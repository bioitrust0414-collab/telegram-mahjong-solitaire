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
 * 單層規則：左右「兩邊都要開放」才能選
 */
export function isBothSidesOpen(coord, currentCoords) {
  const [x, y, z] = coord;

  const hasLeft = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a < x && a >= x - 1.1;
  });

  const hasRight = currentCoords.some(([a, b, c]) => {
    return c === z && b === y && a > x && a <= x + 1.1;
  });

  // 兩邊都沒有鄰接牌才算開放
  return !hasLeft && !hasRight;
}

/** 單層可選條件 */
export function canSelectSingleLayer(coord, currentCoords) {
  if (isCovered(coord, currentCoords)) return false;
  return isBothSidesOpen(coord, currentCoords);
}

/** 多層可選條件：只要沒被壓住 */
export function canSelectMultiLayer(coord, currentCoords) {
  return !isCovered(coord, currentCoords);
}

/**
 * 配對規則：必須完全相同
 * 3筒 只能與 3筒 消除，不能與 3索 / 3萬
 */
export function isMatch(typeA, typeB) {
  return typeA === typeB;
}
