<p align="right"><strong>简体中文</strong> | <a href="./CONTRIBUTING.zh-Hant.md">繁體中文</a> | <a href="./CONTRIBUTING.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回主页</a></p>

# CONTRIBUTING

这个仓库使用“共享源码 + 生成副本”的维护方式。提交修改前，请先理解同步关系，否则很容易改错位置。

## 目录职责

- `shared/meting/`：唯一核心实现源码
- `skill-source/meting-agent/`：Skill 壳子源码，包含 `README`、`SKILL.md`、agent 配置与 CLI
- `skills/meting-agent/`：提交到仓库的生成目录，用于 GitHub 仓库型一键安装
- `dist/skills/meting-agent/`：release 阶段临时生成的分发目录，不提交
- `mcp/src/meting/`：从 `shared/meting/` 生成的 MCP 运行时副本

简化理解就是：真正可维护的源码入口只有 `shared/meting/` 和 `skill-source/meting-agent/`。`skills/meting-agent/` 虽然提交到仓库，但它仍然是生成目录，不要直接修改。

## 推荐修改流程

1. 先在 `shared/meting/` 修改核心逻辑
2. 在 `skill-source/meting-agent/` 修改 Skill 壳子文件
3. 运行同步脚本生成 `mcp` 与 `skills` 副本
4. 运行构建脚本生成 skill release bundle
5. 分别验证 `mcp` 与 skill 产物

## 常用命令

同步共享核心到 `mcp/`：

```powershell
node scripts/sync-mcp-core.mjs
```

同步可提交的 skill 安装目录：

```powershell
node scripts/sync-skills.mjs
```

构建 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
```

校验 `skills/` 没有被手改：

```powershell
npm run verify:skills
```

验证根目录文档格式：

```powershell
npm run format:check
```

验证 `mcp` 子项目：

```powershell
cd mcp
npm install
npm run verify
```

## `skills/` 目录规则

- `skills/meting-agent/` 是生成目录，不是手写源码目录
- 不要直接修改 `skills/meting-agent/`；CI 会运行 `node scripts/sync-skills.mjs` 并检查该目录是否出现 diff
- 如果你想改 `README.md`、`SKILL.md`、`scripts/meting-cli.mjs` 或 `agents/openai.yaml`，请改 `skill-source/meting-agent/` 后重新同步

## 提交前检查

- 核心改动是否发生在 `shared/meting/`
- Skill 壳子改动是否发生在 `skill-source/meting-agent/` 而不是 `skills/meting-agent/`
- 是否重新生成了需要提交的副本或产物
- 是否完成 `mcp` 验证
- 如果改了文档，是否通过 `npm run format:check`
