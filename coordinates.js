/**
 * 座標與開放判斷
 */

// 是否被上方的牌壓住
export function isCovered(coord, currentCoords) {
  const [x, y, z] = coord;
  return currentCoords.some(
    ([a, b, c]) => a === x && b === y && c > z
  );
}

// 是否為純單層
export function isSingleLayer(coords) {
  return coords.every(([, , z]) => z === 0);
}

/**
 * 單層規則：左右「至少一邊開放」即可選
 * （經典麻將接龍 Free Tile）
 * 注意：若要求兩邊都開放，滿版開局會完全無解
 */
export function isSideOpen(coord, currentCoords) {
  const [x, y, z] = coord;

  const hasLeft = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a < x && a >= x - 1.1;
  });

  const hasRight = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a > x && a <= x + 1.1;
  });

  // 至少一邊沒有鄰接牌 → 開放
  return !hasLeft || !hasRight;
}

/** 單層可選條件 */
export function canSelectSingleLayer(coord, currentCoords) {
  if (isCovered(coord, currentCoords)) return false;
  return isSideOpen(coord, currentCoords);
}

/** 多層可選條件：只要沒被壓住 */
export function canSelectMultiLayer(coord, currentCoords) {
  return !isCovered(coord, currentCoords);
}

/**
 * 配對規則：必須完全相同
 * 3筒 只能與 3筒 消除
 */
export function isMatch(typeA, typeB) {
  return typeA === typeB;
}
