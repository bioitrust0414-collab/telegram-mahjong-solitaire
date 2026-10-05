# Telegram Mahjong Solitaire (TMA MVP)

快速驗證麻將接龍小遊戲 + Telegram Mini App + 激勵影片洗牌。

## 目前狀態
- Web 小遊戲骨架已建立
- Telegram WebApp 整合準備完成
- Adsgram 激勵廣告預留位置

## 快速開始（本地開發）

1. Clone 本專案
```bash
git clone https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire.git
cd telegram-mahjong-solitaire
```

2. 用任何靜態伺服器開啟（推薦）
```bash
npx serve .
# 或 python -m http.server 8080
```

3. 在瀏覽器打開後，用 Telegram WebApp 測試環境，或直接在桌面瀏覽器測試基本功能。

## 開發路線圖（3-5 天原型）

### Day 1: 基礎骨架
- [x] 建立 Repo + 基本 HTML 結構
- [ ] 接入完整麻將接龍邏輯（建議從 [ffalt/mah](https://github.com/ffalt/mah) 移植核心或直接 fork 後修改）
- [ ] Telegram.WebApp.ready() + expand()

### Day 2: 核心遊戲
- [ ] 無解判定 (hasValidMoves)
- [ ] 洗牌功能 (shuffle)
- [ ] 基本 UI 與觸控支援

### Day 3: 商業化卡點
- [ ] Adsgram 接入
- [ ] 卡關時彈出「觀看廣告免費洗牌」
- [ ] onReward 回調執行 shuffle

### Day 4-5: 優化與上線
- [ ] Safe Area 處理
- [ ] 用戶 ID 綁定進度
- [ ] 部署到 Vercel / Cloudflare Pages
- [ ] BotFather 設定 Mini App

## 技術選擇
- **遊戲引擎**：先用純 HTML5 / Canvas 或 Phaser 3（可後續切換）
- **廣告**：Adsgram（專為 Telegram Mini Apps 設計）
- **授權**：本專案使用 MIT，可安心商業化

## 重要提醒
- 不要直接使用 AdMob 原生 SDK（TMA 不支援）
- 廣告完成建議後期加上 Server-to-Server 驗證

---

由 Grok 協助建立初始骨架。有問題直接在 Issues 提出。
