/**
 * 路徑搜尋：最多兩次轉折
 * 規則：
 * - 0 轉折：同一直線且中間無阻擋
 * - 1 轉折：一個轉角
 * - 2 轉折：兩個轉角
 */

// 把座標轉成字串 key
function key(x, y, z) {
  return `${x},${y},${z}`;
}

// 建立目前有哪些位置被佔用
function buildOccupied(currentCoords) {
  const set = new Set();
  currentCoords.forEach(([x, y, z]) => set.add(key(x, y, z)));
  return set;
}

// 檢查一條直線路徑是否暢通（不含起點與終點）
function isStraightClear(x1, y1, z1, x2, y2, z2, occupied) {
  // 必須在同一軸上
  if (x1 !== x2 && y1 !== y2 && z1 !== z2) return false;

  // 同位置
  if (x1 === x2 && y1 === y2 && z1 === z2) return true;

  const dx = Math.sign(x2 - x1);
  const dy = Math.sign(y2 - y1);
  const dz = Math.sign(z2 - z1);

  let x = x1 + dx;
  let y = y1 + dy;
  let z = z1 + dz;

  while (x !== x2 || y !== y2 || z !== z2) {
    if (occupied.has(key(x, y, z))) return false;
    x += dx;
    y += dy;
    z += dz;
  }
  return true;
}

/**
 * 檢查兩點之間是否存在 ≤ 2 轉折的路徑
 * 目前實作重點支援「同平面」(同一 z) 的 0/1/2 轉折
 * 立體（跨層）先以直線或簡單轉折支援
 */
export function hasPath(coord1, coord2, currentCoords) {
  const [x1, y1, z1] = coord1;
  const [x2, y2, z2] = coord2;

  // 自己連自己
  if (x1 === x2 && y1 === y2 && z1 === z2) return false;

  const occupied = buildOccupied(currentCoords);

  // 暫時把兩張牌本身視為空（因為它們會被消除）
  occupied.delete(key(x1, y1, z1));
  occupied.delete(key(x2, y2, z2));

  // ===== 0 轉折：直線 =====
  if (isStraightClear(x1, y1, z1, x2, y2, z2, occupied)) {
    return true;
  }

  // ===== 1 轉折 =====
  // 嘗試一個中間轉折點
  // 水平 + 垂直（同層）
  if (z1 === z2) {
    // 轉折點 (x2, y1, z1)
    if (!occupied.has(key(x2, y1, z1)) &&
        isStraightClear(x1, y1, z1, x2, y1, z1, occupied) &&
        isStraightClear(x2, y1, z1, x2, y2, z2, occupied)) {
      return true;
    }
    // 轉折點 (x1, y2, z1)
    if (!occupied.has(key(x1, y2, z1)) &&
        isStraightClear(x1, y1, z1, x1, y2, z1, occupied) &&
        isStraightClear(x1, y2, z1, x2, y2, z2, occupied)) {
      return true;
    }
  }

  // 跨層簡單 1 轉折（先支援同 x 或同 y）
  if (x1 === x2) {
    // 轉折點 (x1, y1, z2)
    if (!occupied.has(key(x1, y1, z2)) &&
        isStraightClear(x1, y1, z1, x1, y1, z2, occupied) &&
        isStraightClear(x1, y1, z2, x2, y2, z2, occupied)) {
      return true;
    }
    // 轉折點 (x1, y2, z1)
    if (!occupied.has(key(x1, y2, z1)) &&
        isStraightClear(x1, y1, z1, x1, y2, z1, occupied) &&
        isStraightClear(x1, y2, z1, x2, y2, z2, occupied)) {
      return true;
    }
  }

  if (y1 === y2) {
    if (!occupied.has(key(x1, y1, z2)) &&
        isStraightClear(x1, y1, z1, x1, y1, z2, occupied) &&
        isStraightClear(x1, y1, z2, x2, y2, z2, occupied)) {
      return true;
    }
    if (!occupied.has(key(x2, y1, z1)) &&
        isStraightClear(x1, y1, z1, x2, y1, z1, occupied) &&
        isStraightClear(x2, y1, z1, x2, y2, z2, occupied)) {
      return true;
    }
  }

  // ===== 2 轉折（同層為主）=====
  if (z1 === z2) {
    const z = z1;
    // 窮舉可能的中間水平/垂直線
    // 方法：固定一個中間 x 或中間 y
    const candidatesX = new Set([x1, x2]);
    const candidatesY = new Set([y1, y2]);

    // 擴展搜尋範圍（簡單版：在兩點形成的矩形外再多找一些）
    for (let dx = -2; dx <= 2; dx++) {
      candidatesX.add(x1 + dx);
      candidatesX.add(x2 + dx);
    }
    for (let dy = -2; dy <= 2; dy++) {
      candidatesY.add(y1 + dy);
      candidatesY.add(y2 + dy);
    }

    // 兩次轉折：先走到 (mx, y1) 再走到 (mx, y2) 再走到 (x2, y2)
    for (const mx of candidatesX) {
      if (mx === x1 && mx === x2) continue;
      const p1 = [mx, y1, z];
      const p2 = [mx, y2, z];
      if (!occupied.has(key(...p1)) && !occupied.has(key(...p2)) &&
          isStraightClear(x1, y1, z, mx, y1, z, occupied) &&
          isStraightClear(mx, y1, z, mx, y2, z, occupied) &&
          isStraightClear(mx, y2, z, x2, y2, z, occupied)) {
        return true;
      }
    }

    // 先走到 (x1, my) 再走到 (x2, my) 再走到 (x2, y2)
    for (const my of candidatesY) {
      if (my === y1 && my === y2) continue;
      const p1 = [x1, my, z];
      const p2 = [x2, my, z];
      if (!occupied.has(key(...p1)) && !occupied.has(key(...p2)) &&
          isStraightClear(x1, y1, z, x1, my, z, occupied) &&
          isStraightClear(x1, my, z, x2, my, z, occupied) &&
          isStraightClear(x2, my, z, x2, y2, z, occupied)) {
        return true;
      }
    }
  }

  return false;
}
