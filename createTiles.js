import { TILE_WIDTH, TILE_HEIGHT, generateBalancedTiles } from "./images.js";
import { shuffle } from "./utils.js";

const TILE_DEPTH = 6; // 略增加深度感，配合半格錯位

export function createTiles(options) {
  const coords = options.coords || [];
  $("#game").empty();

  if (coords.length === 0) return;

  const gameEl = document.getElementById("game");
  if (!gameEl) return;

  const containerW = gameEl.clientWidth;
  const containerH = gameEl.clientHeight;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let maxZ = 0;

  coords.forEach(([x, y, z]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  });

  const rawW = (maxX - minX + 1) * TILE_WIDTH + maxZ * TILE_DEPTH + 12;
  const rawH = (maxY - minY + 1) * TILE_HEIGHT + maxZ * TILE_DEPTH + 12;

  const padding = 16;
  const scale = Math.min(
    (containerW - padding * 2) / rawW,
    (containerH - padding * 2) / rawH,
    1.2
  );

  const tw = TILE_WIDTH * scale;
  const th = TILE_HEIGHT * scale;
  const depth = TILE_DEPTH * scale;

  const layoutW = (maxX - minX + 1) * tw + maxZ * depth;
  const layoutH = (maxY - minY + 1) * th + maxZ * depth;

  // 置中
  const offsetX = (containerW - layoutW) / 2 - minX * tw;
  const offsetY = (containerH - layoutH) / 2 - minY * th;

  const tileData = generateBalancedTiles(coords.length);
  shuffle(tileData);

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const [x, y, z] = coord;
    const data = tileData[i];

    // 半格錯位已寫在座標裡（x+0.5 / y+0.5）
    // 再加一點深度造成的視覺偏移
    const left = x * tw + depth * z * 0.7 + offsetX;
    const top  = y * th + depth * z * 0.7 + offsetY;

    const $tile = $("<div></div>")
      .addClass("tile")
      .css({
        left: left + "px",
        top: top + "px",
        zIndex: Math.floor(z * 30 + y * 2 + x),
        width: tw + "px",
        height: th + "px",
      })
      .attr("coord", coord.toString())
      .attr("type", data.type);

    const $front = $("<div></div>")
      .addClass("tileFront")
      .addClass(data.css)
      .css({
        width: tw + "px",
        height: th + "px",
        fontSize: Math.max(11, 13 * scale) + "px",
      })
      .attr("coord", coord.toString())
      .text(data.text)
      .on("click", () => options.clickFunction(coord));

    const $back = $("<div></div>")
      .addClass("tileBack")
      .css({
        width: (tw + depth) + "px",
        height: (th + depth) + "px",
        top: -depth + "px",
        left: -depth + "px",
      });

    $tile.append($back).append($front).appendTo("#game");
  }
}
