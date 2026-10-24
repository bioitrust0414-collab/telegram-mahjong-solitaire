# `mah` 功能提取與 Telegram 麻將接龍整合盤點

> 目的：以 `telegram-mahjong-solitaire` 為產品主體與執行架構，選擇性提取 `mah` 的成熟功能；不是將 Telegram 單檔遊戲嵌進 `mah`，也不是將整套 Angular 搬入 Telegram。

## 1. 目前架構基線

### Telegram 專案（目標架構）
- 單一 `index.html`，HTML/CSS/JavaScript 同檔，無建置流程與 npm 依賴（除 Telegram WebApp SDK）。
- 已初始化 Telegram Web App 的 `ready()` / `expand()`。
- 自有 144 張烏龜布局、牌面 SVG、牌位遮擋與左右可用判定。
- 透過配對序列建立牌局，最多重試 400 次；`dealNew()` 會重試多組種子。
- 已有計時、分數、步數、提示、復原、洗牌、音效、過關紀錄（localStorage）及手機 safe-area 處理。
- 目前沒有 package.json、模組化測試架構或獨立的遊戲引擎檔案；`index.html` 內有 `window.__MJ` 測試/除錯介面。
- 目前紀錄是單機 localStorage；Telegram 用戶同步、排行榜、激勵廣告仍是後續規劃，不可當作已完成能力。

### `mah` 專案（功能來源）
- Angular 架構，遊戲核心由 `Game`、`Board`、`Clock`、`Builder` 等模型組成。
- 有可解/隨機牌局建構器、不同遊戲模式、布局選擇、提示與復原、洗牌、音效/音樂、設定與多語系。
- 有 Zen mode、每日挑戰與挑戰 HUD/結算紀錄。
- 透過 `AppService`、`Settings` 與 storage provider 管理狀態及持久化。
- Angular 元件與 signals 不應直接複製進 Telegram 單檔架構；應移植行為與規則，按目標架構重寫。

## 2. 功能提取決策矩陣

| 能力 | Telegram 現況 | `mah` 可提取內容 | 決策 |
|---|---|---|---|
| 144 張烏龜布局 | 已有 | 不需複製布局；比較可解性與邊界規則 | 保留 Telegram，補測試 |
| 牌位/可消除判定 | 已有 | `Board` / `Stone` 狀態設計與規則分離概念 | 先比對規則，再抽成純函式 |
| 可解發牌 | 已有自訂演算法 | 可解牌局建構器與驗證思路 | 保留目標實作；以模擬測試驗證，不盲目替換 |
| 多布局 | 目前固定烏龜布局 | 布局選擇、布局映射格式 | 高優先：設計 layout registry，再逐步加入布局 |
| 遊戲難度/規則模式 | 目前固定規則 | EASY/EXPERT 等模式及規則差異 | 中優先：先定義模式規格，不直接照搬 UI |
| 提示 | 已有 | 提示成本、提示狀態及行為一致性 | 保留並補測試；再評估可配置成本 |
| 復原 | 已有簡單配對堆疊 | 狀態復原與計分一致性 | 高優先：改用完整 action/history 記錄，避免復原後狀態不一致 |
| 洗牌/無路可走救援 | 已有 | 卡局判定與救援策略 | 高優先：區分重新分配剩餘牌與整局重開，寫明規則 |
| 計時/暫停 | 有計時，未見完整暫停流程 | Clock 與 run/pause 狀態機 | 高優先：抽出明確遊戲狀態與暫停處理 |
| 設定/音效/音樂 | 有音效開關 | 設定模型、音效與音樂分離 | 中優先：以單一 settings store 保存設定 |
| Zen mode | 無 | 低干擾控制模式 | 中優先：新增純 UI 模式，不改遊戲規則 |
| 每日挑戰 | 無 | 固定日期種子、挑戰結算、最佳紀錄 | 中後期：先做可重現 seed 與本機紀錄 |
| 多語系 | 目前繁體中文 UI | 語言資源與語言切換策略 | 中優先：先抽離 UI 字串，再增加語言 |
| 設定/紀錄持久化 | localStorage best time/score | storage provider 抽象化 | 高優先：定義版本化存檔格式 |
| Telegram 平台能力 | 已載入 SDK，ready/expand | `mah` 不作為來源 | 保留平台 adapter；避免核心遊戲依賴 Telegram SDK |
| 廣告、帳號同步、排行榜 | 尚未完成 | 無需直接移植 | 暫緩，先完成核心穩定性與平台資料模型 |

## 3. 目標模組邊界（不引入 Angular）

建議在 Telegram repo 內逐步將單檔拆成下列純 JavaScript/TypeScript 模組；第一階段不必導入大型框架。

- `game/layouts.js`：布局定義與座標。
- `game/rules.js`：牌型分組、可用判定、配對規則。
- `game/deal.js`：可解發牌、seeded RNG、牌局驗證。
- `game/state.js`：狀態、計時、分數、步數、歷史紀錄與 undo。
- `game/actions.js`：select、match、hint、undo、shuffle、restart。
- `ui/board.js`：DOM/SVG 呈現與互動事件。
- `platform/telegram.js`：SDK ready/expand、safe area、未來的 Haptic/BackButton 等適配。
- `storage/save.js`：存檔版本、最佳成績、設定與每日挑戰資料。

核心遊戲模組不可直接呼叫 Telegram SDK、DOM 或 localStorage；由 UI、platform、storage 層注入依賴，便於單元測試及未來在普通瀏覽器運行。

## 4. 建議執行階段

### Phase 1 — 功能與規則基線
- [x] 檢查兩個 repo 的入口、遊戲狀態與建構器代表檔案。
- [x] 建立本整合盤點文件。
- [ ] 對照兩邊的牌型分組、花牌/季節牌規則、遮擋判定、可解牌局保證與計分規則。
- [ ] 為目前 Telegram 引擎建立回歸測試案例（144 張數量、配對規則、free tile、win/stuck、undo）。

### Phase 2 — 抽離核心邏輯
- [ ] 從 `index.html` 拆出純遊戲模組，保持 UI 行為不變。
- [ ] 先以測試鎖定規則，再調整 history/undo、pause/resume、seeded deal。
- [ ] 確保既有 Telegram Mini App 入口仍能運作。

### Phase 3 — 移植 `mah` 精華
- [ ] 加入布局 registry 與至少一個可切換布局。
- [ ] 加入遊戲模式設定、Zen mode。
- [ ] 加入可重現的每日挑戰與版本化本機紀錄。
- [ ] 抽離 UI 字串並建立多語系資源。

### Phase 4 — 驗證與發布
- [ ] 測試桌面、iOS/Android Telegram WebView、安全區與旋轉/縮放。
- [ ] 驗證新局、配對、提示、復原、洗牌、計時、結算全流程。
- [ ] 以獨立 PR 合併；只有測試通過才部署正式版本。

## 5. 重要風險與驗收條件

1. **不要一次性重寫全部遊戲。** 每一階段都要保持可玩的版本。
2. **不要先搬 UI。** 先鎖定規則與狀態，再移植布局、挑戰與外觀。
3. **不要宣稱「保證可解」只靠演算法名稱。** 必須用自動模擬或求解器驗證每次發牌的完整勝局路徑。
4. **undo 必須復原完整狀態。** 牌面、分數、步數、計時與提示成本應有一致且明確的規則。
5. **Telegram SDK 與遊戲核心分離。** 一般瀏覽器測試不能因缺少 Telegram SDK 而失敗。
6. `mah` 仍作為參考來源；正式產品與部署主體是本 repo。

## 6. 本次範圍外

- 不合併兩個 GitHub repository。
- 不把整個 `mah` Angular app 當作 Telegram 子頁。
- 不接廣告、帳號後端或排行榜，直到核心模組化與測試完成。
- 不把尚未實作的 Telegram 登入、雲端同步或廣告標示為已完成。
