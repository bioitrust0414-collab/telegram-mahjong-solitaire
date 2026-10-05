import { COORDINATES } from "./coordinates.js";
import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";

const TILE_DEPTH = 5;
const TOTAL_OFFSET_TOP = 12;
const TOTAL_OFFSET_LEFT = 12;

export function createTiles(options) {
  // 先清空
  $("#game").empty();

  // 計算實際可用寬高，動態縮放
  const gameEl = document.getElementById("game");
  const maxW = gameEl.clientWidth - 24;
  const maxH = gameEl.clientHeight - 24;

  // 原始布局大約需要的寬高（經驗值）
  const layoutW = 15 * TILE_WIDTH;
  const layoutH = 9 * TILE_HEIGHT;
  const scale = Math.min(maxW / layoutW, maxH / layoutH, 1.1);

  const tw = TILE_WIDTH * scale;
  const th = TILE_HEIGHT * scale;
  const depth = TILE_DEPTH * scale;

  for (let counter = 0; counter < COORDINATES.length; counter++) {
    const coord = COORDINATES[counter];
    const [x, y, z] = coord;
    const image = images[counter];

    const left = x * tw + depth * z + TOTAL_OFFSET_LEFT;
    const top  = y * th + depth * z + TOTAL_OFFSET_TOP;

    const $tile = $("<div></div>")
      .addClass("tile")
      .css({
        left: left + "px",
        top: top + "px",
        zIndex: Math.floor(z * 10 + y),
        width: tw + "px",
        height: th + "px"
      })
      .attr("coord", coord.toString())
      .attr("type", image.attr("type"));

    const $front = $("<div></div>")
      .addClass("tileFront")
      .addClass(image.data("css") || "")
      .css({
        width: tw + "px",
        height: th + "px",
        fontSize: Math.max(11, 13 * scale) + "px"
      })
      .attr("coord", coord.toString())
      .html(image.html())
      .on("click", () => options.clickFunction(coord));

    const $back = $("<div></div>")
      .addClass("tileBack")
      .css({
        width: (tw + depth) + "px",
        height: (th + depth) + "px",
        top: -depth + "px",
        left: -depth + "px"
      });

    $tile.append($back).append($front).appendTo("#game");
  }
}
