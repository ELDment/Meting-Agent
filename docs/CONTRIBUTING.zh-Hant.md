<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./CONTRIBUTING.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回首頁</a></p>

# CONTRIBUTING

本倉庫採用「共享原始碼 + 生成副本」的維護方式。提交修改前，請先理解同步關係，否則很容易改到錯誤位置

## 為什麼剛 clone 後不能直接編譯

倉庫預設只保留共享原始碼，不提交 skill release 產物，也不會把 `shared/meting/` 的全部執行時副本長期維護在每個目標目錄中

直接 clone 後會遇到兩個現實限制：

- skill 的可分發產物位於 `dist/skills/meting-agent/scripts/meting/`，這個目錄需要執行建構腳本後才會生成
- `mcp/` 的建構雖然會在其 npm scripts 中自動執行 `sync:core`，但如果你跳過同步前置步驟，直接從生成檔案視角排查問題，很容易得到錯誤結論

簡化理解就是：這個倉庫不是「每個交付物目錄都自帶完整、靜態、可直接維護的原始碼副本」，而是先維護 `shared/meting/`，再生成給 `mcp/src/meting/` 和 skill 使用的副本

## 推薦修改流程

1. 先在 `shared/meting/` 修改核心邏輯
2. 執行同步腳本生成 `mcp` 副本
3. 執行建構腳本生成 skill release bundle
4. 分別驗證 `mcp` 與 skill 產物

## 常用命令

同步共享核心到 `mcp/`：

```powershell
node scripts/sync-mcp-core.mjs
```

建構 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
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
- 是否重新生成了需要提交的副本或產物
- 是否完成 `mcp` 驗證
- 如果改了文件，是否通過 `npm run format:check`
