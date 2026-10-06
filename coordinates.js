import { disjoint } from "./utils.js";

/**
 * 判斷一張牌是否可以點選（開放）
 * 規則：
 * 1. 正上方不能有牌（更高的 z）
 * 2. 左邊或右邊至少有一邊是空的（同一層）
 */
export function isOpen(coord, currentCoords) {
  const [x, y, z] = coord;

  // 1. 如果這張牌已經不在場上，直接 false
  const stillExists = currentCoords.some(
    ([a, b, c]) => a === x && b === y && c === z
  );
  if (!stillExists) return false;

  // 2. 正上方有牌 → 被壓住，不能點
  const hasTileAbove = currentCoords.some(
    ([a, b, c]) => a === x && b === y && c > z
  );
  if (hasTileAbove) return false;

  // 3. 檢查左右是否有鄰接牌（同一層 z）
  // 允許一點誤差（因為有些布局用了 0.5）
  const hasLeft = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a < x && a >= x - 1.1;
  });

  const hasRight = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a > x && a <= x + 1.1;
  });

  // 左右至少一邊是空的，就可以點
  return !hasLeft || !hasRight;
}
