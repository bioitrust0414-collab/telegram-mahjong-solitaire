import { disjoint } from "./utils.js";

// 這個檔案現在只負責「是否可點選」的判斷邏輯
// 實際座標由 levels.js 提供

function leftNeighbors(coord) {
  const [x, y, z] = coord;
  return [[x - 1, y, z]];
}

function rightNeighbors(coord) {
  const [x, y, z] = coord;
  return [[x + 1, y, z]];
}

export function isOpen(coord, currentCoords) {
  if (disjoint([coord], currentCoords)) return false;

  const [x, y, z] = coord;

  // 上方有牌就不可點
  if (currentCoords.some(([a, b, c]) => a === x && b === y && c > z)) {
    return false;
  }

  // 左右至少一邊是空的才可點
  return (
    disjoint(leftNeighbors(coord), currentCoords) ||
    disjoint(rightNeighbors(coord), currentCoords)
  );
}
