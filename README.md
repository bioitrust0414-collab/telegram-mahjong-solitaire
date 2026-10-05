# Telegram Mahjong Solitaire (TMA MVP)

基於 MIT 授權的開源麻將接龍，準備改造成 Telegram Mini App + 激勵影片洗牌。

## 來源與授權
- 核心遊戲邏輯來自：[ScriptRaccoon/mahjong-solitaire](https://github.com/ScriptRaccoon/mahjong-solitaire)（MIT License）
- 本專案額外加入 Telegram WebApp 與 Adsgram 整合準備
- 完整授權請見 `LICENSE` 檔案

## 目前狀態
- [x] 導入 MIT 核心程式碼
- [ ] 複製牌面圖片（img 資料夾）
- [ ] 加入 Telegram WebApp
- [ ] 卡關時觸發 Adsgram 激勵廣告 → 洗牌

## 如何讓遊戲跑起來（重要）

1. Clone 本專案
```bash
git clone https://github.com/bioitrust0414-collab/telegram-mahjong-solitaire.git
cd telegram-mahjong-solitaire
```

2. **必須手動複製圖片**（因為圖片是二進位檔，無法直接推送）：
   - 到原專案下載：https://github.com/ScriptRaccoon/mahjong-solitaire
   - 把整個 `img/` 資料夾複製到本專案根目錄

3. 本地啟動
```bash
npx serve .
# 或任何靜態伺服器
```

4. 瀏覽器打開即可玩原本的麻將接龍。

## 下一步（我會繼續幫你做）
1. 修改 `index.html` 加入 Telegram.WebApp
2. 在無解時（`There are no moves left`）觸發廣告彈窗
3. 廣告成功後呼叫原本的 `restartGame()` 當作洗牌
4. 部署與 Bot 設定

## 技術說明
- 純 HTML + JS + CSS（使用 jQuery）
- 無框架，容易修改
- 原本就有無解判定與重新開始功能，非常適合接廣告

有問題直接跟我說，我繼續幫你整合 Telegram + 廣告部分。
