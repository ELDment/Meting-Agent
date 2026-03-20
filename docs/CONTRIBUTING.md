<p align="right"><strong>简体中文</strong> | <a href="./CONTRIBUTING.zh-Hant.md">繁體中文</a> | <a href="./CONTRIBUTING.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回主页</a></p>

# CONTRIBUTING

本仓库采用“共享源码 + 生成副本”的维护方式。提交修改前，请先理解同步关系，否则很容易改错位置。

## 生成副本是怎么维护的

仓库把 `shared/meting/` 作为唯一真源。`mcp/src/meting/` 和 `skills/meting-agent/scripts/meting/` 这两个运行时副本，会在 `main` 和 `dev` 有新 push 后由 GitHub Actions 强制同步并回写到分支。

这意味着：

- 之后再 clone `main` 或 `dev`，理论上会拿到 workflow 回写后的最新副本。
- 但你仍然不应该把这两个生成目录当作手工维护源码。手改它们，下一次 workflow 同步时仍然可能被覆盖。
- `mcp/` 的 npm scripts 会自动执行 `sync:core`，但如果你跳过同步前置步骤，只盯着生成文件排查问题，很容易得到错误结论。

简化理解就是：先维护 `shared/meting/`，生成目录只用于验证与发布，而 `main/dev` 上的已跟踪副本由 GitHub Actions 负责归一化。

## 推荐修改流程

1. 先在 `shared/meting/` 修改核心逻辑
2. 运行同步脚本生成 `mcp` 和 skill 的本地副本
3. 按需验证 `mcp` 包与 skill 运行目录
4. push 到 `main` 或 `dev` 后，让 GitHub Actions 覆盖、提交并发布同步后的副本

## 常用命令

同步两个生成目录：

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

## 提交前检查

- 核心改动是否发生在 `shared/meting/`
- 是否按验证需要重新生成了本地副本
- 是否完成 `mcp` 验证
- 如果改了文档，是否通过 `npm run format:check`
- 是否避免把生成副本当作主要编辑目标
