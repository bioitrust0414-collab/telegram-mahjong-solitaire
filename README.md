# 麻將消除 · Telegram Mini App

經典 144 張烏龜布局麻將接龍，已接入 Telegram WebApp，準備接激勵廣告洗牌。

**Repo：** https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire

---

## 遊戲規則

- 點擊兩張**相同**的牌即可消除
- 牌必須「上方無遮擋」，且「左或右至少一側空開」
- 花牌（梅蘭竹菊）互相可配
- 季節牌（春夏秋冬）互相可配
- 發牌保證可解；無路可走時可洗牌重整

---

## 功能

| 功能 | 狀態 |
|------|------|
| 經典烏龜 144 張布局 | ✅ |
| 可解發牌演算法 | ✅ |
| SVG 精美牌面 | ✅ |
| 計時 / 分數 / 剩餘 / 步數 | ✅ |
| 提示 / 復原 / 洗牌 | ✅ |
| 音效 | ✅ |
| 過關紀錄 (localStorage) | ✅ |
| 手機適配 + Safe Area | ✅ |
| Telegram WebApp ready/expand | ✅ |
| 激勵廣告洗牌 (Adsgram) | ⏳ 規劃中 |

---

## 本地運行

```bash
git clone https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire.git
cd telegram-mahjong-solitaire
npx serve .
```

瀏覽器打開即可遊玩。

---

## 技術說明

- 單檔 `index.html`（HTML + CSS + JS）
- 無外部依賴（除 Telegram WebApp SDK）
- `window.restartGame` 已暴露，之後可接廣告成功回調做洗牌

---

## 後續規劃

1. 接入 Adsgram 激勵影片（無路可走時看廣告免費洗牌）
2. Telegram 用戶進度同步
3. 排行榜

---

MIT License
