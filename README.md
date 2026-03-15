# meting-mcp

`meting-mcp` 基于原版 **Meting Node.js** 核心实现，只保留适合 MCP Server 发布与运行的形态。底层支持这些平台：

- `netease`
- `tencent`
- `kugou`
- `baidu`
- `kuwo`

## 功能概览

- 基于原版 Meting 的统一音乐接口
- 通过 stdio 暴露为 MCP Server
- 支持搜索、歌曲、专辑、歌手、歌单、播放链接、歌词、封面等操作
- 所有 MCP 工具默认返回格式化后的 JSON 文本

## 安装

```bash
npm install
```

发布后可直接运行：

```bash
npx meting-mcp
```

## MCP 接入

示例配置：

```json
{
  "mcpServers": {
    "meting": {
      "command": "npx",
      "args": ["-y", "meting-mcp"]
    }
  }
}
```

提供的 MCP 工具：

- `platforms`
- `search`
- `song`
- `album`
- `artist`
- `playlist`
- `url`
- `lyric`
- `pic`

## 工具参数

所有工具都支持：

- `platform`: `netease`、`tencent`、`kugou`、`baidu`、`kuwo`
- `cookie`: 可选，对应平台 Cookie

各工具额外参数：

- `search`: `keyword`，可选 `type`、`page`、`limit`
- `song`: `id`
- `album`: `id`
- `artist`: `id`，可选 `limit`
- `playlist`: `id`
- `url`: `id`，可选 `br`
- `lyric`: `id`
- `pic`: `id`，可选 `size`

## 版权与致谢

底层核心来自原项目 [metowolf/Meting](https://github.com/metowolf/Meting)，遵循 [MIT](./LICENSE) License。
