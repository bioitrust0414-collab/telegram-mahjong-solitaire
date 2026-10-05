// 改成顏色 + 數字/文字的虛擬牌面，不需要外部圖片
export const images = [];
export const TILE_WIDTH = 42;
export const TILE_HEIGHT = 56;

const types = [
  { name: "dots",      label: "筒", number: 9, multiplicity: 4, css: "tile-dots" },
  { name: "bamboo",    label: "索", number: 9, multiplicity: 4, css: "tile-bamboo" },
  { name: "character", label: "萬", number: 9, multiplicity: 4, css: "tile-character" },
  { name: "wind",      label: "風", number: 4, multiplicity: 4, css: "tile-wind",
    labels: ["東", "南", "西", "北"] },
  { name: "dragon",    label: "龍", number: 3, multiplicity: 4, css: "tile-dragon",
    labels: ["中", "發", "白"] },
  { name: "flower",    label: "花", number: 4, multiplicity: 1, css: "tile-flower",
    labels: ["梅", "蘭", "竹", "菊"] },
  { name: "season",    label: "季", number: 4, multiplicity: 1, css: "tile-season",
    labels: ["春", "夏", "秋", "冬"] },
];

for (const type of types) {
  for (let j = 1; j <= type.number; j++) {
    for (let i = 1; i <= type.multiplicity; i++) {
      const text = type.labels ? type.labels[j - 1] : `${j}${type.label}`;
      const typeKey = type.multiplicity > 1 ? `${type.name}${j}` : type.name;

      // 建立一個簡單的 jQuery 物件當作「圖片」
      const $el = $(`<div class="tile-content ${type.css}">${text}</div>`);
      $el.attr("type", typeKey);
      $el.data("css", type.css);
      images.push($el);
    }
  }
}
