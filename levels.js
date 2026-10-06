import { interval, matrixInterval } from "./utils.js";

/**
 * 10 關由小到大
 * 多層使用「半牌面錯位交疊」：上層座標用 x+0.5 / y+0.5
 */

// 第1關：4×4 單層
const lv1 = matrixInterval(0, 3, 0, 3, (x, y) => [x, y, 0]);

// 第2關：單層稍大
const lv2 = matrixInterval(0, 5, 0, 3, (x, y) => [x, y, 0]);

// 第3關：二層，上層半格錯位
const lv3 = [
  ...matrixInterval(0, 5, 0, 4, (x, y) => [x, y, 0]),
  // 上層：半牌面錯位
  ...matrixInterval(1, 4, 1, 3, (x, y) => [x + 0.5, y + 0.5, 1]),
];

// 第4關
const lv4 = [
  ...matrixInterval(0, 7, 0, 4, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 6, 1, 3, (x, y) => [x + 0.5, y + 0.5, 1]),
];

// 第5關
const lv5 = [
  ...matrixInterval(0, 7, 0, 5, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 6, 1, 4, (x, y) => [x + 0.5, y + 0.5, 1]),
];

// 第6關：三層錯位
const lv6 = [
  ...matrixInterval(0, 8, 0, 5, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 7, 1, 4, (x, y) => [x + 0.5, y + 0.5, 1]),
  ...matrixInterval(2, 6, 2, 3, (x, y) => [x, y, 2]), // 再錯回整數，形成交疊感
];

// 第7關
const lv7 = [
  ...matrixInterval(0, 9, 0, 6, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 8, 1, 5, (x, y) => [x + 0.5, y + 0.5, 1]),
  ...matrixInterval(2, 7, 2, 4, (x, y) => [x, y, 2]),
];

// 第8關：四層
const lv8 = [
  ...matrixInterval(0, 10, 0, 6, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 9, 1, 5, (x, y) => [x + 0.5, y + 0.5, 1]),
  ...matrixInterval(2, 8, 2, 4, (x, y) => [x, y, 2]),
  ...matrixInterval(3, 7, 3, 3, (x, y) => [x + 0.5, y + 0.5, 3]),
];

// 第9關
const lv9 = [
  ...matrixInterval(0, 11, 0, 7, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 10, 1, 6, (x, y) => [x + 0.5, y + 0.5, 1]),
  ...matrixInterval(2, 9, 2, 5, (x, y) => [x, y, 2]),
  ...matrixInterval(3, 8, 3, 4, (x, y) => [x + 0.5, y + 0.5, 3]),
];

// 第10關：最高挑戰
const lv10 = [
  ...matrixInterval(0, 12, 0, 7, (x, y) => [x, y, 0]),
  ...matrixInterval(1, 11, 1, 6, (x, y) => [x + 0.5, y + 0.5, 1]),
  ...matrixInterval(2, 10, 2, 5, (x, y) => [x, y, 2]),
  ...matrixInterval(3, 9, 3, 4, (x, y) => [x + 0.5, y + 0.5, 3]),
  ...matrixInterval(4, 8, 3, 4, (x, y) => [x, y, 4]),
  [6.5, 3.5, 5],
];

export const LEVELS = [
  { id: 1,  name: "4×4 入門",   desc: "最簡單的小棋盤",   coords: lv1,  difficulty: "入門" },
  { id: 2,  name: "初學",       desc: "稍微大一點",       coords: lv2,  difficulty: "簡單" },
  { id: 3,  name: "基礎",       desc: "二層半格錯位",     coords: lv3,  difficulty: "簡單" },
  { id: 4,  name: "進階I",      desc: "牌數增加",         coords: lv4,  difficulty: "普通" },
  { id: 5,  name: "進階II",     desc: "8×6 規模",         coords: lv5,  difficulty: "普通" },
  { id: 6,  name: "挑戰I",      desc: "三層錯位交疊",     coords: lv6,  difficulty: "困難" },
  { id: 7,  name: "挑戰II",     desc: "更大更密",         coords: lv7,  difficulty: "困難" },
  { id: 8,  name: "高手",       desc: "四層交疊",         coords: lv8,  difficulty: "很難" },
  { id: 9,  name: "大師",       desc: "高密度棋盤",       coords: lv9,  difficulty: "很難" },
  { id: 10, name: "終極挑戰",   desc: "最大規模",         coords: lv10, difficulty: "極難" },
];
