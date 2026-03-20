<p align="right"><a href="./README.md">简体中文</a> | <a href="./README.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

<p align="right"><a href="../README.md">⬅️ Back to Home</a></p>

# Meting-Agent

`Meting-Agent` is an MCP service built on top of **[metowolf/Meting](https://github.com/metowolf/Meting)**. It supports music platforms such as [NetEase Cloud Music](https://music.163.com/) (`netease`), [Tencent Music](https://y.qq.com/) (`tencent`), [Kugou Music](https://www.kugou.com/) (`kugou`), and [Kuwo Music](https://www.kuwo.cn/) (`kuwo`), and provides capabilities for search, songs, albums, artists, playlists, playback URLs, lyrics, and cover images.

<details>
<summary><b>Screenshot</b></summary>

![Meting-Agent Showcase](../SHOWCASE.png)
</details>

## Installation

Published on npm: [@eldment/meting-agent](https://www.npmjs.com/package/@eldment/meting-agent)

## MCP Tools

- `platforms`: List supported platforms and their codes
- `search`: Search songs, albums, artists, or platform-specific resources by keyword
- `song`: Get details by song ID
- `album`: Get details by album ID
- `artist`: Get works by artist ID
- `playlist`: Get details by playlist ID
- `url`: Get a playback URL by song ID
- `lyric`: Get lyrics by song ID
- `pic`: Get a cover image URL by resource ID

## MCP Integration

Claude example:

```json
{
  "mcpServers": {
    "meting": {
      "command": "npx",
      "args": [
        "-y",
        "@eldment/meting-agent@latest"
      ],
      "env": {
        "METING_NETEASE_COOKIE": "__csrf=...; MUSIC_U=...; NMTID=...;",
        "METING_TENCENT_COOKIE": "uin=...; qm_keyst=...;",
        "METING_KUGOU_COOKIE": "KugooID=...; t=...; dfid=...; mid=...;",
        "METING_KUWO_COOKIE": "HMACCOUNT=...; sid=...;"
      },
      "timeout": 60000
    }
  }
}
```

Codex example:

```toml
[mcp_servers.meting]
type = "stdio"
command = "npx"
args = [
    "-y",
    "@eldment/meting-agent@latest",
]
env = {
    METING_NETEASE_COOKIE = "__csrf=...; MUSIC_U=...; NMTID=...;",
    METING_TENCENT_COOKIE = "uin=...; qm_keyst=...;",
    METING_KUGOU_COOKIE = "KugooID=...; t=...; dfid=...; mid=...;",
    METING_KUWO_COOKIE = "HMACCOUNT=...; sid=...;",
}
tool_timeout_sec = 60
```

## Cookie Rules

Cookies are resolved at runtime in this order:

1. `METING_<PLATFORM>_COOKIE`
2. `METING_COOKIE`
3. The `cookie` field in the MCP tool arguments

Supported environment variables:

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE` (shared fallback)

If you only need a cookie for one platform, prefer the platform-specific variable. If you want one shared fallback, set only `METING_COOKIE`.
