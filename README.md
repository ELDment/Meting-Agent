# Meting-Agent

`Meting-Agent` 维护两套运行时独立的交付物：

- `mcp/`：可发布的 Node.js MCP Server，对外名称统一为 `Meting Agent`。
- `skills/meting-agent/`：面向 Codex 的 skill 源文件，最终以 GitHub Release 资产分发。

## 目录说明

- `shared/core-src/`：唯一的核心源码来源，包含 `meting.js` 和全部 providers。
- `mcp/`：MCP Server 运行时副本与发布配置。
- `skills/meting-agent/`：skill 元数据与静态脚本源文件。
- `scripts/sync-mcp-core.mjs`：把共享核心生成到 `mcp/src/`。
- `scripts/build-skill-release.mjs`：构建可下载的 skill release bundle。

## 常用命令

同步共享核心到 MCP：

```powershell
node scripts/sync-mcp-core.mjs
```

构建 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
```

验证 MCP 子项目：

```powershell
cd mcp
npm install
npm run verify
```

本地验证 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
node dist/meting-agent-skill/scripts/meting-cli.mjs platforms
node dist/meting-agent-skill/scripts/meting-cli.mjs search --platform netease --keyword "我怀念的" --limit 3
```

## 维护原则

- 只在 `shared/core-src/` 修改核心实现。
- `mcp/src/meting.js` 和 `mcp/src/providers/` 由同步脚本生成，不直接维护。
- skill 的运行时副本只在 `dist/meting-agent-skill/` 构建时生成，用户从 GitHub Release 下载，不克隆源码仓库。
