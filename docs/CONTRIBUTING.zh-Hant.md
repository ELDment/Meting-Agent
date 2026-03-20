<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./CONTRIBUTING.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回主頁</a></p>

# CONTRIBUTING

本倉庫採用「共享原始碼 + 生成副本」的維護方式。提交修改前，請先理解同步關係，否則很容易改錯位置。

## 生成副本是怎麼維護的

倉庫把 `shared/meting/` 視為唯一真源。`mcp/src/meting/` 和 `skills/meting-agent/scripts/meting/` 這兩個執行期副本，會在 `main` 和 `dev` 有新 push 後由 GitHub Actions 強制同步並回寫到分支。

這表示：

- 之後再 clone `main` 或 `dev`，理論上會拿到 workflow 回寫後的最新副本。
- 但你仍然不應該把這兩個生成目錄當作手動維護原始碼。手改它們，下一次 workflow 同步時仍可能被覆蓋。
- `mcp/` 的 npm scripts 會自動執行 `sync:core`，但如果你跳過同步前置步驟，只盯著生成檔案排查問題，很容易得到錯誤結論。

簡化理解就是：先維護 `shared/meting/`，生成目錄只用於驗證與發佈，而 `main/dev` 上的已追蹤副本由 GitHub Actions 負責正規化。

## 推薦修改流程

1. 先在 `shared/meting/` 修改核心邏輯
2. 執行同步腳本生成 `mcp` 和 skill 的本地副本
3. 視需要驗證 `mcp` 套件與 skill 執行目錄
4. push 到 `main` 或 `dev` 後，讓 GitHub Actions 覆蓋、提交並發佈同步後的副本

## 常用命令

同步兩個生成目錄：

```powershell
npm run sync:all
```

只同步 `mcp/` 副本：

```powershell
npm run sync:mcp
```

只同步 skill 副本：

```powershell
npm run sync:skill
```

驗證根目錄文件格式：

```powershell
npm run format:check
```

驗證 `mcp` 子專案：

```powershell
cd mcp
npm install
npm run verify
```

## 提交前檢查

- 核心改動是否發生在 `shared/meting/`
- 是否按驗證需要重新生成了本地副本
- 是否完成 `mcp` 驗證
- 如果改了文件，是否通過 `npm run format:check`
- 是否避免把生成副本當作主要編輯目標
