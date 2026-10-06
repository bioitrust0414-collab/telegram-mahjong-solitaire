import { interval, matrixInterval } from "./utils.js";

// ===== 關卡定義（由簡到難） =====
// 每個關卡包含：名稱、描述、座標陣列

// 第1關：超簡單（單層 + 少量牌）
const level1Coords = [
  ...interval(2, 7, (x) => [x, 1, 0]),
  ...interval(2, 7, (x) => [x, 2, 0]),
  ...interval(3, 6, (x) => [x, 3, 0]),
  ...interval(3, 6, (x) => [x, 4, 0]),
];

// 第2關：簡單（兩層）
const level2Coords = [
  ...interval(1, 8, (x) => [x, 0, 0]),
  ...interval(1, 8, (x) => [x, 1, 0]),
  ...interval(2, 7, (x) => [x, 2, 0]),
  ...interval(2, 7, (x) => [x, 3, 0]),
  ...interval(3, 6, (x) => [x, 4, 0]),
  // 第二層
  ...matrixInterval(3, 6, 1, 3, (x, y) => [x, y, 1]),
];

// 第3關：標準（經典多層）
const level3Coords = [
  ...interval(1, 12, (x) => [x, 0, 0]),
  ...interval(3, 10, (x) => [x, 1, 0]),
  ...interval(2, 11, (x) => [x, 2, 0]),
  [0, 3.5, 0],
  ...interval(1, 12, (x) => [x, 3, 0]),
  ...interval(1, 12, (x) => [x, 4, 0]),
  [13, 3.5, 0],
  [14, 3.5, 0],
  ...interval(2, 11, (x) => [x, 5, 0]),
  ...interval(3, 10, (x) => [x, 6, 0]),
  ...interval(1, 12, (x) => [x, 7, 0]),
  ...matrixInterval(4, 9, 1, 6, (x, y) => [x, y, 1]),
  ...matrixInterval(5, 8, 2, 5, (x, y) => [x, y, 2]),
  ...matrixInterval(6, 7, 3, 4, (x, y) => [x, y, 3]),
  [6.5, 3.5, 4],
].reverse();

// 第4關：進階（更緊密 + 較高）
const level4Coords = [
  ...interval(0, 11, (x) => [x, 0, 0]),
  ...interval(1, 10, (x) => [x, 1, 0]),
  ...interval(0, 11, (x) => [x, 2, 0]),
  ...interval(1, 10, (x) => [x, 3, 0]),
  ...interval(0, 11, (x) => [x, 4, 0]),
  ...interval(1, 10, (x) => [x, 5, 0]),
  ...interval(2, 9, (x) => [x, 6, 0]),
  // 多層
  ...matrixInterval(2, 9, 1, 5, (x, y) => [x, y, 1]),
  ...matrixInterval(3, 8, 2, 4, (x, y) => [x, y, 2]),
  ...matrixInterval(4, 7, 2, 4, (x, y) => [x, y, 3]),
  [5.5, 3, 4],
  [5.5, 3, 5],
];

// 第5關：困難（高密度 + 容易死局）
const level5Coords = [
  ...interval(0, 13, (x) => [x, 0, 0]),
  ...interval(0, 13, (x) => [x, 1, 0]),
  ...interval(1, 12, (x) => [x, 2, 0]),
  ...interval(0, 13, (x) => [x, 3, 0]),
  ...interval(1, 12, (x) => [x, 4, 0]),
  ...interval(0, 13, (x) => [x, 5, 0]),
  ...interval(1, 12, (x) => [x, 6, 0]),
  ...interval(2, 11, (x) => [x, 7, 0]),
  // 高層
  ...matrixInterval(2, 11, 1, 6, (x, y) => [x, y, 1]),
  ...matrixInterval(3, 10, 2, 5, (x, y) => [x, y, 2]),
  ...matrixInterval(4, 9, 2, 5, (x, y) => [x, y, 3]),
  ...matrixInterval(5, 8, 3, 4, (x, y) => [x, y, 4]),
  [6.5, 3.5, 5],
  [6.5, 3.5, 6],
];

export const LEVELS = [
  {
    id: 1,
    name: "入門",
    desc: "單層少量牌，輕鬆上手",
    coords: level1Coords,
    difficulty: "簡單"
  },
  {
    id: 2,
    name: "初級",
    desc: "兩層結構，開始有策略",
    coords: level2Coords,
    difficulty: "簡單"
  },
  {
    id: 3,
    name: "標準",
    desc: "經典多層布局",
    coords: level3Coords,
    difficulty: "普通"
  },
  {
    id: 4,
    name: "進階",
    desc: "更緊密，需要小心規劃",
    coords: level4Coords,
    difficulty: "困難"
  },
  {
    id: 5,
    name: "挑戰",
    desc: "高密度，容易無解",
    coords: level5Coords,
    difficulty: "非常難"
  }
];
