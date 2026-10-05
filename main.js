import { images } from "./images.js";
import { createTiles } from "./createTiles.js";
import {
  shuffle,
  remove,
  tileAt,
  tileFrontAt,
  writeStatus,
  randEl,
  sleep,
} from "./utils.js";
import { isOpen, COORDINATES } from "./coordinates.js";

let selectedCoord = null;
let currentCoords = [...COORDINATES];
let hintCoord = null;

$(document).ready(initGame);

async function initGame() {
  shuffle(images);
  createTiles({ clickFunction: clickTileAt });
  await checkMovePossible("遊戲載入中...");
}

function clickTileAt(coord) {
  if (!isOpen(coord, currentCoords)) return;

  if (selectedCoord) {
    if (coord.toString() === selectedCoord.toString()) {
      unselectTileAt(coord);
      return;
    } else {
      const tile = tileAt(coord);
      const selectedTile = tileAt(selectedCoord);
      if (tile.attr("type") === selectedTile.attr("type")) {
        executeMove(tile, selectedTile, coord, selectedCoord);
        return;
      }
    }
  }
  selectTileAt(coord);
}

function executeMove(tile, selectedTile, coord, coord2) {
  selectedCoord = null;
  hintCoord = null;

  selectedTile.animate({ opacity: 0 }, 120);
  tile.animate({ opacity: 0 }, 120, () => {
    selectedTile.hide();
    tile.hide();
    remove(coord, currentCoords);
    remove(coord2, currentCoords);

    if (currentCoords.length === 0) {
      writeStatus("恭喜過關！🎉");
    } else {
      checkMovePossible("計算中...");
    }
  });
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
  await sleep(30);

  const moves = [];
  for (let i = 0; i < currentCoords.length; i++) {
    for (let j = i + 1; j < currentCoords.length; j++) {
      const p = currentCoords[i];
      const q = currentCoords[j];
      if (
        p.toString() !== q.toString() &&
        tileAt(p).attr("type") === tileAt(q).attr("type") &&
        isOpen(p, currentCoords) &&
        isOpen(q, currentCoords)
      ) {
        moves.push([p, q]);
      }
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
    // 之後這裡會觸發廣告彈窗
  } else if (moves.length === 1) {
    writeStatus("只剩 1 步可走");
  } else {
    writeStatus(`還有 ${moves.length} 步可走`);
  }
}

$("#restartButton").on("click", async () => {
  $("#game").css("opacity", 0.3);
  await sleep(150);
  restartGame();
  await checkMovePossible("重新開始...");
  $("#game").css("opacity", 1);
});

$("#hintButton").on("click", () => {
  if (!hintCoord) return;
  const times = 5;
  const delay = 160;
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      tileFrontAt(hintCoord).toggleClass("alertTile");
    }, delay * i);
  }
  setTimeout(() => {
    selectTileAt(hintCoord);
  }, delay * times);
});

function restartGame() {
  selectedCoord = null;
  hintCoord = null;
  currentCoords = [...COORDINATES];
  shuffle(images);
  createTiles({ clickFunction: clickTileAt });
}

// 暴露給之後廣告成功後呼叫
window.restartGame = restartGame;
