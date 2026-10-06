/**
 * 只檢查「是否被壓住」
 * 新規則下，左右是否開放改由路徑搜尋決定
 */
export function isCovered(coord, currentCoords) {
  const [x, y, z] = coord;

  // 正上方有牌就視為被壓住
  return currentCoords.some(
    ([a, b, c]) => a === x && b === y && c > z
  );
}

// 保留舊名稱相容
export function isOpen(coord, currentCoords) {
  return !isCovered(coord, currentCoords);
}
