/**
 * 座標與開放判斷
 * 單層 / 多層 使用不同規則
 */

// 是否被上方的牌壓住
export function isCovered(coord, currentCoords) {
  const [x, y, z] = coord;
  return currentCoords.some(
    ([a, b, c]) => a === x && b === y && c > z
  );
}

// 判斷目前關卡是否為「純單層」
export function isSingleLayer(coords) {
  return coords.every(([, , z]) => z === 0);
}

/**
 * 單層規則：左右至少一邊開放
 * （經典麻將接龍 Free Tile）
 */
export function isSideOpen(coord, currentCoords) {
  const [x, y, z] = coord;

  // 左邊是否有鄰接牌（允許 1 的誤差）
  const hasLeft = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a < x && a >= x - 1.1;
  });

  // 右邊是否有鄰接牌
  const hasRight = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a > x && a <= x + 1.1;
  });

  // 至少一邊是空的 → 開放
  return !hasLeft || !hasRight;
}

/**
 * 單層：可以被選取的條件
 * 1. 沒有被壓住
 * 2. 左右至少一邊開放
 */
export function canSelectSingleLayer(coord, currentCoords) {
  if (isCovered(coord, currentCoords)) return false;
  return isSideOpen(coord, currentCoords);
}

/**
 * 多層：可以被選取的條件
 * 只要求沒有被壓住（路徑另外判斷）
 */
export function canSelectMultiLayer(coord, currentCoords) {
  return !isCovered(coord, currentCoords);
}
