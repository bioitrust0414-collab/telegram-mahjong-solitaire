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
 * 配對規則：不區分花色，只比數字
 * - 筒/索/萬：數字相同即可互消（3筒 = 3索 = 3萬）
 * - 風、龍、花、季：維持相同 type 才能消
 */
export function isMatch(typeA, typeB) {
  if (typeA === typeB) return true;

  // 抽出數字（dots1 / bamboo1 / character1 → 1）
  const numA = extractNumber(typeA);
  const numB = extractNumber(typeB);

  if (numA !== null && numB !== null && numA === numB) {
    return true;
  }
  return false;
}

function extractNumber(type) {
  // dots1, bamboo3, character9
  const m = String(type).match(/^(dots|bamboo|character)(\d+)$/);
  if (m) return m[2];
  return null;
}
