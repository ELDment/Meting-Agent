# Meting-MCP

`Meting-MCP` 是基于 **[metowolf/Meting](https://github.com/metowolf/Meting)** 构建的 MCP Server，支持 `netease`、`tencent`、`kugou`、`baidu`、`kuwo` 等音乐平台，提供搜索、歌曲、专辑、歌手、歌单、播放链接、歌词、封面等能力

## 提供的 MCP 工具

- `platforms`: 列出当前支持的音乐平台及其平台代号
- `search`: 按关键字在指定平台搜索歌曲、专辑、歌手或其他资源
- `song`: 按歌曲 ID 获取歌曲详情
- `album`: 按专辑 ID 获取专辑详情
- `artist`: 按歌手 ID 获取歌手信息或作品列表
- `playlist`: 按歌单 ID 获取歌单内容
- `url`: 按歌曲 ID 获取可播放链接
- `lyric`: 按歌曲 ID 获取歌词内容
- `pic`: 按图片或资源 ID 获取封面图链接

## MCP 接入

Claude 示例配置：

```json
{
  "mcpServers": {
    "meting": {
      "command": "npx",
      "args": [
        "-y",
        "@eldment/meting-mcp@latest"
      ],
      "env": {},
      "timeout": 60000
    }
  }
}
```

Codex 示例配置：

```toml
[mcp_servers.meting]
type = "stdio"
command = "npx"
args = [
    "-y",
    "@eldment/meting-mcp@latest",
]
env = {}
tool_timeout_sec = 60
disabled = false
```

---

关键词: MCP Server | Model Context Protocol | Music API | Node.js MCP | AI Tool Integration | NetEase Cloud Music | Tencent QQ Music | KuGou Music | Baidu Music | Kuwo Music | Lyrics API | Playlist API
