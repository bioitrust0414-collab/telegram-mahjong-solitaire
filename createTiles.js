import { TILE_WIDTH, TILE_HEIGHT, generateBalancedTiles } from "./images.js";
import { shuffle } from "./utils.js";

const TILE_DEPTH = 5;

export function createTiles(options) {
  const coords = options.coords || [];
  $("#game").empty();

  if (coords.length === 0) return;

  const gameEl = document.getElementById("game");
  if (!gameEl) return;

  const containerW = gameEl.clientWidth;
  const containerH = gameEl.clientHeight;

  // 計算布局的原始邊界
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

  // 原始布局寬高（含深度偏移）
  const rawW = (maxX - minX + 1) * TILE_WIDTH + maxZ * TILE_DEPTH + 8;
  const rawH = (maxY - minY + 1) * TILE_HEIGHT + maxZ * TILE_DEPTH + 8;

  // 縮放以適合容器，並留一點邊距
  const padding = 16;
  const scale = Math.min(
    (containerW - padding * 2) / rawW,
    (containerH - padding * 2) / rawH,
    1.2
  );

  const tw = TILE_WIDTH * scale;
  const th = TILE_HEIGHT * scale;
  const depth = TILE_DEPTH * scale;

  // 縮放後的布局實際寬高
  const layoutW = (maxX - minX + 1) * tw + maxZ * depth;
  const layoutH = (maxY - minY + 1) * th + maxZ * depth;

  // 置中偏移量
  const offsetX = (containerW - layoutW) / 2 - minX * tw;
  const offsetY = (containerH - layoutH) / 2 - minY * th;

  // 產生成對牌並打亂
  const tileData = generateBalancedTiles(coords.length);
  shuffle(tileData);

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const [x, y, z] = coord;
    const data = tileData[i];

    const left = x * tw + depth * z + offsetX;
    const top  = y * th + depth * z + offsetY;

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
