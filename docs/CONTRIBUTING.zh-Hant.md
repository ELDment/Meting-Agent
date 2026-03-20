<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./CONTRIBUTING.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回首頁</a></p>

# CONTRIBUTING

這個倉庫使用「共享原始碼 + 生成副本」的維護方式。提交修改前，請先理解同步關係，否則很容易改錯位置。

## 目錄職責

- `shared/meting/`：唯一核心實作原始碼
- `skill-source/meting-agent/`：Skill 外殼原始碼，包含 `README`、`SKILL.md`、agent 設定與 CLI
- `skills/meting-agent/`：提交到倉庫的生成目錄，用於 GitHub 倉庫型一鍵安裝
- `dist/skills/meting-agent/`：release 階段暫時生成的分發目錄，不提交
- `mcp/src/meting/`：由 `shared/meting/` 生成的 MCP 執行時副本

簡化理解就是：真正可維護的原始碼入口只有 `shared/meting/` 與 `skill-source/meting-agent/`。`skills/meting-agent/` 雖然會提交到倉庫，但它仍然是生成目錄，不要直接修改。

## 推薦修改流程

1. 先在 `shared/meting/` 修改核心邏輯
2. 在 `skill-source/meting-agent/` 修改 Skill 外殼檔案
3. 執行同步腳本生成 `mcp` 與 `skills` 副本
4. 執行構建腳本生成 skill release bundle
5. 分別驗證 `mcp` 與 skill 產物

## 常用命令

同步共享核心到 `mcp/`：

```powershell
node scripts/sync-mcp-core.mjs
```

同步可提交的 skill 安裝目錄：

```powershell
node scripts/sync-skills.mjs
```

構建 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
```

校驗 `skills/` 沒有被手動修改：

```powershell
npm run verify:skills
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

## `skills/` 目錄規則

- `skills/meting-agent/` 是生成目錄，不是手寫原始碼目錄
- 不要直接修改 `skills/meting-agent/`；CI 會執行 `node scripts/sync-skills.mjs` 並檢查該目錄是否出現 diff
- 如果你想改 `README.md`、`SKILL.md`、`scripts/meting-cli.mjs` 或 `agents/openai.yaml`，請改 `skill-source/meting-agent/` 後重新同步

## 提交前檢查

- 核心改動是否發生在 `shared/meting/`
- Skill 外殼改動是否發生在 `skill-source/meting-agent/` 而不是 `skills/meting-agent/`
- 是否重新生成了需要提交的副本或產物
- 是否完成 `mcp` 驗證
- 如果改了文件，是否通過 `npm run format:check`
