# 麻將接龍 (Telegram Mini App)

一個專為 Telegram Mini App 設計的麻將接龍小遊戲，支援關卡挑戰、單層／立體分離邏輯與激勵廣告洗牌（規劃中）。

**Repo：** https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire

---

## 遊戲規則（目前版本）

本遊戲**自動區分單層與多層**，使用不同消除邏輯：

### 一、單層關卡（所有牌 z = 0）

採用經典麻將接龍（Free Tile）規則：

1. **同花色同數字** 才能消除
2. **不能壓牌**（雖然單層通常沒有上方牌）
3. **左右至少一邊開放** 才能被選取
4. 兩張都符合開放條件 → 可直接消除（**不需要路徑**）

### 二、多層／立體關卡（有 z > 0 的牌）

1. **同花色同數字** 才能消除
2. **不能壓牌**（正上方有牌不可選）
3. **最多兩次轉折的路徑** 才能消除  
   - 同平面或跨層皆支援  
   - 0 轉折（直線）、1 轉折、2 轉折

成功配對後會顯示**金色連線動畫**。

> 標題會顯示「（單層）」或「（立體）」方便辨識目前模式。

---

## 目前功能

| 功能 | 狀態 | 說明 |
|------|------|------|
| 10 關由簡至難 | ✅ | 從 4×4 小棋盤逐步增加到高密度多層 |
| 單層 / 多層邏輯分離 | ✅ | 自動偵測並套用對應規則 |
| 顏色 + 數字牌面 | ✅ | 不需外部圖片即可遊玩 |
| 手機友善介面 | ✅ | 支援 Safe Area、大按鈕、自適應縮放 |
| 連線動畫 | ✅ | 配對成功時顯示 |
| 關卡解鎖進度 | ✅ | localStorage |
| 提示功能 | ✅ | 高亮可消除的牌 |
| Telegram WebApp 準備 | ✅ | ready / expand |
| 激勵廣告洗牌 | ⏳ | 規劃中（Adsgram） |

---

## 關卡一覽

| 關卡 | 名稱 | 難度 | 模式傾向 |
|------|------|------|----------|
| 1 | 4×4 入門 | 入門 | 單層 |
| 2 | 初學 | 簡單 | 單層 |
| 3 | 基礎 | 簡單 | 開始有二層 |
| 4～5 | 進階 | 普通 | 多層 |
| 6～8 | 挑戰／高手 | 困難 | 多層 |
| 9～10 | 大師／終極 | 極難 | 高密度多層 |

---

## 如何本地運行

```bash
git clone https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire.git
cd telegram-mahjong-solitaire
npx serve .
```

---

## 技術說明

- 純前端：HTML + JavaScript + CSS + jQuery
- `coordinates.js`：單層開放判斷 / 多層壓牌判斷
- `pathfinder.js`：最多兩次轉折路徑搜尋（多層使用）
- `levels.js`：10 關布局
- 進度存於 `localStorage`

---

## 授權

- 參考 [ScriptRaccoon/mahjong-solitaire](https://github.com/ScriptRaccoon/mahjong-solitaire)（MIT）
- 本專案修改與適配同樣以 MIT 授權

---

## 後續規劃

1. Adsgram 激勵影片（無路可走時看廣告洗牌）
2. 連線動畫改為顯示真實轉折路徑
3. Telegram 用戶進度同步
4. 音效與過關表現優化
