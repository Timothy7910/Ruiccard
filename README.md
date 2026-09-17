# 靈境典藏 · Ruiccard

以藝術展館形式展示《鳴潮》角色的互動 3D 全息卡牌。目前收錄 40 張：原有景燃、鎖暝與心，以及新增的 37 張角色／服裝卡。

## 本機預覽

需要 Node.js 18 或更新版本：

```sh
node web/server.mjs
```

開啟 http://127.0.0.1:4173/ 。卡面支援拖曳視差、縮放、翻面、自動旋轉與材質調整，並提供手機版排版。

頂部「鳴潮典藏」可開啟分類目錄，輸入角色或服裝名稱搜尋。展示頁「下載卡面」輸出目前角度與材質的 1400 × 1800 PNG；目錄中的「下載卡面 PNG」直接下載完整正面。下載檔是靜態圖片，互動景深在網站中呈現。

- 心：`/?card=hsin`（前景人物已放大約 24%）
- 鎖暝：`/?card=suoming`
- 景燃：`/?card=jingran`

## 專案結構

## Vercel 部署

匯入此儲存庫，Root Directory 保持儲存庫根目錄即可。根目錄的 `vercel.json` 指定 `web` 為靜態輸出目錄，無須安裝依賴或執行建置。若既有專案 Root Directory 已設為 `web`，該目錄亦有對應設定。修改設定後請建立新的 Deployment；舊的部署網址不會更新。

## 檔案

- `web/`：可獨立部署的靜態網站，內含已打包的 JavaScript。
- `web/collection.json`：典藏目錄。
- `web/cards/`：新增卡牌的模型、圖層與設定。
- `sources/`：40 張卡牌的 Blender 檔、圖層及設定；新增卡牌另附素材來源與製作紀錄。
- `verification/`：桌面、手機與多卡切換的驗收報告及截圖。

修改 viewer 後重新打包：

```sh
cd web
npm ci --ignore-scripts
npx --yes esbuild@0.25.0 app.js --bundle --format=esm --target=es2020 --outfile=app.bundle.js
```

新增已製作完成的卡牌：

```sh
node add-card.mjs /path/to/new-card/web new-card-id
```

匯入器會複製素材並更新目錄，不會覆蓋既有卡牌。

## 製作與素材

使用 [RuiC-card-skill](https://github.com/HRuiCcc/RuiC-card-skill) 製作。角色原圖由使用者提供；分層素材包含 AI 輔助重建，並非原圖逐像素去背。心的前景人物已依回饋重新處理。角色與原作相關權利歸原權利人所有。

新增 37 張採用獨立人物透明層、重建背景、衍生線稿與原生繁體中文排版。人物依姿勢置中，長披風與武器另做視覺位置修正。「夏日旖旎」及「桂枝寧芙」為服裝名稱，其餘卡面題名為本典藏原創美術文案。角色資料與清單見 [鳴潮典藏製作紀錄](docs/wuthering-waves-collection.md)。

Blender 材質在網頁中以 GLSL 重建，兩者呈現並非逐像素相同。此儲存庫包含網站檔案，同步儲存庫本身不代表已啟用公開網站託管。
