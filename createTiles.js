import { TILE_WIDTH, TILE_HEIGHT, images } from "./images.js";

const TILE_DEPTH = 5;
const TOTAL_OFFSET_TOP = 12;
const TOTAL_OFFSET_LEFT = 12;

export function createTiles(options) {
  const coords = options.coords || [];
  $("#game").empty();

  if (coords.length === 0) return;

  const gameEl = document.getElementById("game");
  if (!gameEl) return;

  const maxW = gameEl.clientWidth - 20;
  const maxH = gameEl.clientHeight - 20;

  // 計算布局邊界
  let maxX = 0, maxY = 0;
  coords.forEach(([x, y]) => {
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });

  const layoutW = (maxX + 2) * TILE_WIDTH;
  const layoutH = (maxY + 2) * TILE_HEIGHT;
  const scale = Math.min(maxW / layoutW, maxH / layoutH, 1.15);

  const tw = TILE_WIDTH * scale;
  const th = TILE_HEIGHT * scale;
  const depth = TILE_DEPTH * scale;

  // 為了讓牌面數量對應，我們重複使用 images（洗過的）
  const tileImages = [...images];
  while (tileImages.length < coords.length) {
    tileImages.push(...images);
  }

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const [x, y, z] = coord;
    const image = tileImages[i % tileImages.length];

    const left = x * tw + depth * z + TOTAL_OFFSET_LEFT;
    const top = y * th + depth * z + TOTAL_OFFSET_TOP;

    const $tile = $("<div></div>")
      .addClass("tile")
      .css({
        left: left + "px",
        top: top + "px",
        zIndex: Math.floor(z * 20 + y),
        width: tw + "px",
        height: th + "px",
      })
      .attr("coord", coord.toString())
      .attr("type", image.attr("type"));

    const $front = $("<div></div>")
      .addClass("tileFront")
      .addClass(image.data("css") || "")
      .css({
        width: tw + "px",
        height: th + "px",
        fontSize: Math.max(11, 13 * scale) + "px",
      })
      .attr("coord", coord.toString())
      .html(image.html())
      .on("click", () => options.clickFunction(coord));

    const $back = $("<div></div>")
      .addClass("tileBack")
      .css({
        width: tw + depth + "px",
        height: th + depth + "px",
        top: -depth + "px",
        left: -depth + "px",
      });

    $tile.append($back).append($front).appendTo("#game");
  }
}
