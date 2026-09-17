# Netlify 部署

此專案是已完成打包的靜態網站。入口為 `web/index.html`，不是專案根目錄。

## 從 GitHub 部署

連接本儲存庫的 `main` 分支，根目錄的 `netlify.toml` 會指定：

- Base directory：專案根目錄（`.`）
- Build command：留空
- Publish directory：`web`

更新儲存庫後重新部署。若設定過 Package directory，請清空，讓 Netlify 使用根目錄的設定。

## 手動上傳

直接上傳 `web` 資料夾，讓部署內容最外層包含 `index.html`、`viewer.html` 與卡片素材。不要上傳整個儲存庫根目錄；手動上傳不會執行建置設定。

角色與語言使用 `?card=...&lang=...`，不需要額外的單頁應用路由重寫。
