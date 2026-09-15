# 靈境典藏 · Ruiccard

以藝術展館形式展示《鳴潮》角色的互動 3D 全息卡牌。目前收錄景燃、鎖暝與心。

## 本機預覽

需要 Node.js 18 或更新版本：

```sh
node web/server.mjs
```

開啟 http://127.0.0.1:4173/ 。卡面支援拖曳視差、縮放、翻面、自動旋轉與材質調整，並提供手機版排版。

- 心：`/?card=hsin`（前景人物已放大約 24%）
- 鎖暝：`/?card=suoming`
- 景燃：`/?card=jingran`

## 專案結構

- `web/`：可獨立部署的靜態網站，內含已打包的 JavaScript。
- `web/collection.json`：典藏目錄。
- `web/cards/`：新增卡牌的模型、圖層與設定。
- `sources/`：三張卡牌的 Blender 檔、圖層及設定。
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

Blender 材質在網頁中以 GLSL 重建，兩者呈現並非逐像素相同。此儲存庫包含網站檔案，同步儲存庫本身不代表已啟用公開網站託管。
