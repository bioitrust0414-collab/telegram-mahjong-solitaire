import { createTiles } from "./createTiles.js";
import {
  remove,
  tileAt,
  tileFrontAt,
  writeStatus,
  randEl,
  sleep,
} from "./utils.js";
import {
  isCovered,
  isSingleLayer,
  canSelectSingleLayer,
  canSelectMultiLayer,
} from "./coordinates.js";
import { hasPath } from "./pathfinder.js";
import { LEVELS } from "./levels.js";

let selectedCoord = null;
let currentCoords = [];
let hintCoord = null;
let currentLevelId = 1;
let COORDINATES = [];
let singleLayerMode = true; // 當前關卡是否為單層模式

// ===== 進度 =====
function getUnlockedLevel() {
  return parseInt(localStorage.getItem("mahjong_unlocked") || "1", 10);
}
function unlockLevel(id) {
  const current = getUnlockedLevel();
  if (id > current) localStorage.setItem("mahjong_unlocked", id);
}

// ===== 關卡選擇 =====
function showLevelSelect() {
  const unlocked = getUnlockedLevel();
  let html = `<div class="level-select"><h2>選擇關卡</h2><div class="level-grid">`;
  LEVELS.forEach((lv) => {
    const locked = lv.id > unlocked;
    html += `<button class="level-btn ${locked ? "locked" : ""}" data-id="${lv.id}" ${locked ? "disabled" : ""}>
      <div class="lv-num">第 ${lv.id} 關</div>
      <div class="lv-name">${lv.name}</div>
      <div class="lv-diff">${lv.difficulty}</div>
      ${locked ? "<div class='lock'>🔒</div>" : ""}
    </button>`;
  });
  html += `</div></div>`;
  $("#game-wrapper").html(html);
  $(".level-btn:not(.locked)").on("click", function () {
    startLevel(parseInt($(this).data("id"), 10));
  });
}

async function startLevel(id) {
  currentLevelId = id;
  const level = LEVELS.find((l) => l.id === id);
  COORDINATES = [...level.coords];
  currentCoords = [...COORDINATES];

  // 自動判斷單層 / 多層
  singleLayerMode = isSingleLayer(COORDINATES);

  $("#game-wrapper").html(`<div id="game"></div>`);
  $("#header .level-title").text(
    `第 ${id} 關・${level.name}${singleLayerMode ? "（單層）" : "（立體）"}`
  );

  selectedCoord = null;
  hintCoord = null;
  createTiles({ clickFunction: clickTileAt, coords: COORDINATES });
  await checkMovePossible("開始遊戲");
}

// ===== 連線動畫 =====
function showConnectionLine(tileA, tileB) {
  const game = document.getElementById("game");
  if (!game) return;
  const rectA = tileA[0].getBoundingClientRect();
  const rectB = tileB[0].getBoundingClientRect();
  const gameRect = game.getBoundingClientRect();
  const x1 = rectA.left + rectA.width / 2 - gameRect.left;
  const y1 = rectA.top + rectA.height / 2 - gameRect.top;
  const x2 = rectB.left + rectB.width / 2 - gameRect.left;
  const y2 = rectB.top + rectB.height / 2 - gameRect.top;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "connection-line");
  svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;`;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#fbbf24");
  line.setAttribute("stroke-width", "4");
  line.setAttribute("stroke-linecap", "round");
  line.style.strokeDasharray = "1000";
  line.style.strokeDashoffset = "1000";
  line.style.animation = "drawLine 0.35s ease forwards";
  svg.appendChild(line);
  game.appendChild(svg);
  setTimeout(() => svg.remove(), 400);
}

// ===== 核心點擊邏輯（分開單層 / 多層）=====
function canSelect(coord) {
  if (singleLayerMode) {
    return canSelectSingleLayer(coord, currentCoords);
  }
  return canSelectMultiLayer(coord, currentCoords);
}

function clickTileAt(coord) {
  if (!canSelect(coord)) return;

  if (selectedCoord) {
    if (coord.toString() === selectedCoord.toString()) {
      unselectTileAt(coord);
      return;
    }

    const tile = tileAt(coord);
    const selectedTile = tileAt(selectedCoord);

    // 必須同類型
    if (tile.attr("type") !== selectedTile.attr("type")) {
      unselectTileAt(selectedCoord);
      selectTileAt(coord);
      return;
    }

    // 根據模式決定是否可消除
    let canMatch = false;

    if (singleLayerMode) {
      // 單層：兩張都「開放」即可消除（不需要路徑）
      canMatch =
        canSelectSingleLayer(selectedCoord, currentCoords) &&
        canSelectSingleLayer(coord, currentCoords);
    } else {
      // 多層：必須有 ≤ 2 轉折的路徑
      canMatch = hasPath(selectedCoord, coord, currentCoords);
    }

    if (canMatch) {
      executeMove(tile, selectedTile, coord, selectedCoord);
    } else {
      // 不能消，改選新牌
      unselectTileAt(selectedCoord);
      selectTileAt(coord);
    }
    return;
  }

  selectTileAt(coord);
}

function executeMove(tile, selectedTile, coord, coord2) {
  selectedCoord = null;
  hintCoord = null;
  showConnectionLine(selectedTile, tile);

  setTimeout(() => {
    selectedTile.addClass("removing");
    tile.addClass("removing");
    setTimeout(() => {
      selectedTile.hide();
      tile.hide();
      remove(coord, currentCoords);
      remove(coord2, currentCoords);
      if (currentCoords.length === 0) {
        onLevelClear();
      } else {
        checkMovePossible("計算中...");
      }
    }, 280);
  }, 180);
}

function selectTileAt(coord) {
  if (!coord) return;
  unselectTileAt(selectedCoord);
  selectedCoord = coord;
  tileFrontAt(coord).addClass("selectedTile");
}

function unselectTileAt(coord) {
  if (!coord) return;
  tileFrontAt(coord).removeClass("selectedTile");
  selectedCoord = null;
}

async function checkMovePossible(message) {
  writeStatus(message);
  await sleep(40);

  const moves = [];
  for (let i = 0; i < currentCoords.length; i++) {
    for (let j = i + 1; j < currentCoords.length; j++) {
      const p = currentCoords[i];
      const q = currentCoords[j];

      if (p.toString() === q.toString()) continue;
      if (tileAt(p).attr("type") !== tileAt(q).attr("type")) continue;

      let valid = false;
      if (singleLayerMode) {
        valid =
          canSelectSingleLayer(p, currentCoords) &&
          canSelectSingleLayer(q, currentCoords);
      } else {
        valid =
          !isCovered(p, currentCoords) &&
          !isCovered(q, currentCoords) &&
          hasPath(p, q, currentCoords);
      }

      if (valid) moves.push([p, q]);
    }
  }

  updateStatus(moves);
  if (moves.length > 0) {
    hintCoord = randEl(randEl(moves));
  } else {
    hintCoord = null;
  }
}

function updateStatus(moves) {
  if (moves.length === 0) {
    writeStatus("無路可走了！🚧");
  } else if (moves.length === 1) {
    writeStatus("只剩 1 步可走");
  } else {
    writeStatus(`還有 ${moves.length} 步可走`);
  }
}

async function onLevelClear() {
  writeStatus("恭喜過關！🎉");
  unlockLevel(currentLevelId + 1);
  $("#game").addClass("level-clear");
  await sleep(800);
  const nextId = currentLevelId + 1;
  if (nextId <= LEVELS.length) {
    if (confirm(`第 ${currentLevelId} 關完成！\n是否前往第 ${nextId} 關？`)) {
      startLevel(nextId);
    } else {
      showLevelSelect();
    }
  } else {
    alert("恭喜你通過所有關卡！");
    showLevelSelect();
  }
}

// 按鈕
$("#restartButton").on("click", async () => {
  if ($(".level-select").length) return;
  $("#game").css("opacity", 0.3);
  await sleep(150);
  currentCoords = [...COORDINATES];
  selectedCoord = null;
  hintCoord = null;
  createTiles({ clickFunction: clickTileAt, coords: COORDINATES });
  await checkMovePossible("重新開始");
  $("#game").css("opacity", 1);
});

$("#hintButton").on("click", () => {
  if (!hintCoord || $(".level-select").length) return;
  const times = 5;
  const delay = 160;
  for (let i = 0; i < times; i++) {
    setTimeout(() => tileFrontAt(hintCoord).toggleClass("alertTile"), delay * i);
  }
  setTimeout(() => selectTileAt(hintCoord), delay * times);
});

$("#levelSelectBtn").on("click", showLevelSelect);

window.restartGame = () => {
  currentCoords = [...COORDINATES];
  selectedCoord = null;
  hintCoord = null;
  createTiles({ clickFunction: clickTileAt, coords: COORDINATES });
  checkMovePossible("洗牌完成");
};

$(document).ready(showLevelSelect);
