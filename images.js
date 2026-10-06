// 顏色 + 文字牌面定義（不再預先產生全部 144 張）
export const TILE_WIDTH = 42;
export const TILE_HEIGHT = 56;

// 可用的牌種（用來配對）
export const TILE_TYPES = [
  // 筒 1-9
  ...Array.from({ length: 9 }, (_, i) => ({
    type: `dots${i + 1}`,
    text: `${i + 1}筒`,
    css: "tile-dots"
  })),
  // 索 1-9
  ...Array.from({ length: 9 }, (_, i) => ({
    type: `bamboo${i + 1}`,
    text: `${i + 1}索`,
    css: "tile-bamboo"
  })),
  // 萬 1-9
  ...Array.from({ length: 9 }, (_, i) => ({
    type: `character${i + 1}`,
    text: `${i + 1}萬`,
    css: "tile-character"
  })),
  // 風
  { type: "wind1", text: "東", css: "tile-wind" },
  { type: "wind2", text: "南", css: "tile-wind" },
  { type: "wind3", text: "西", css: "tile-wind" },
  { type: "wind4", text: "北", css: "tile-wind" },
  // 龍
  { type: "dragon1", text: "中", css: "tile-dragon" },
  { type: "dragon2", text: "發", css: "tile-dragon" },
  { type: "dragon3", text: "白", css: "tile-dragon" },
  // 花（任意花可互配，所以用同一個 type）
  { type: "flower", text: "梅", css: "tile-flower" },
  { type: "flower", text: "蘭", css: "tile-flower" },
  { type: "flower", text: "竹", css: "tile-flower" },
  { type: "flower", text: "菊", css: "tile-flower" },
  // 季（任意季可互配）
  { type: "season", text: "春", css: "tile-season" },
  { type: "season", text: "夏", css: "tile-season" },
  { type: "season", text: "秋", css: "tile-season" },
  { type: "season", text: "冬", css: "tile-season" },
];

/**
 * 根據需要的牌數，產生「成對」的牌列表
 * 保證每種 type 都是偶數張，開局一定有可消的牌
 */
export function generateBalancedTiles(count) {
  // 確保是偶數
  if (count % 2 !== 0) count -= 1;

  const result = [];
  const typePool = [...TILE_TYPES];

  // 先盡量用不同種類，每種先放 2 張（一對）
  let i = 0;
  while (result.length < count) {
    const base = typePool[i % typePool.length];
    // 加一對
    result.push({ ...base });
    result.push({ ...base });
    i++;

    // 安全保護，避免無限迴圈
    if (i > 1000) break;
  }

  // 如果多了就裁到精確數量
  return result.slice(0, count);
}
