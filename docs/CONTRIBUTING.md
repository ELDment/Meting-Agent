# CONTRIBUTING

本仓库采用“共享源码 + 生成副本”的维护方式。提交修改前，请先理解同步关系，否则很容易改到错误位置

## 为什么刚克隆后不能直接编译

仓库默认只保留共享源码，不提交 skill release 产物，也不把 `shared/meting/` 的全部运行时副本长期维护在每个目标目录中

直接克隆后会遇到两个现实限制：

- skill 的可分发产物位于 `dist/meting-agent-skill/scripts/meting/`，这个目录需要运行构建脚本后才会生成
- `mcp/` 的构建虽然会在其 npm scripts 中自动执行 `sync:core`，但如果你跳过同步前置步骤，直接按生成文件视角排查问题，很容易得到错误结论

简化理解就是：这个仓库不是“每个交付物目录都自带完整、静态、可直接维护的源码副本”，而是先维护 `shared/meting/`，再生成给 `mcp/src/meting/` 和 skill 使用的副本

## 推荐修改流程

1. 先在 `shared/meting/` 修改核心逻辑
2. 运行同步脚本生成 `mcp` 副本
3. 运行构建脚本生成 skill release bundle
4. 分别验证 `mcp` 和 skill 产物

## 常用命令

同步共享核心到 `mcp/`：

```powershell
node scripts/sync-mcp-core.mjs
```

构建 skill release bundle：

```powershell
node scripts/build-skill-release.mjs
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
- 是否重新生成了需要提交的副本或产物
- 是否完成 `mcp` 验证
- 如果改了文档，是否通过 `npm run format:check`
