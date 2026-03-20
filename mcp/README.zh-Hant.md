<p align="right"><a href="./README.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./README.EN.md">English</a></p>

<p align="right"><a href="../README.md">⬅️ 返回首頁</a></p>

# Meting-Agent

`Meting-Agent` 是基於 **[metowolf/Meting](https://github.com/metowolf/Meting)** 建構的 MCP 服務，支援 [網易雲音樂](https://music.163.com/)（`netease`）、[騰訊音樂](https://y.qq.com/)（`tencent`）、[酷狗音樂](https://www.kugou.com/)（`kugou`）、[酷我音樂](https://www.kuwo.cn/)（`kuwo`）等音樂平台，提供搜尋、歌曲、專輯、歌手、歌單、播放連結、歌詞、封面等能力

<details>
<summary><b>執行截圖</b></summary>

![Meting-Agent Showcase](../SHOWCASE.png)
</details>

## 取得

透過 npm 發布，專案詳情: [@eldment/meting-agent](https://www.npmjs.com/package/@eldment/meting-agent)

## MCP 工具

- `platforms`：列出支援的平台與平台代號
- `search`：依關鍵字搜尋歌曲、專輯、歌手或平台特定資源
- `song`：依歌曲 ID 取得詳情
- `album`：依專輯 ID 取得詳情
- `artist`：依歌手 ID 取得作品
- `playlist`：依歌單 ID 取得詳情
- `url`：依歌曲 ID 取得播放位址
- `lyric`：依歌曲 ID 取得歌詞
- `pic`：依資源 ID 取得封面位址

## MCP 接入

Claude 設定範例：

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

Codex 設定範例：

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

## Cookie 規則

執行時依以下優先級取得 Cookie：

1. `METING_<PLATFORM>_COOKIE`
2. `METING_COOKIE`
3. MCP 工具參數中的 `cookie`

支援的環境變數：

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE`（通用）

如果只需要替某一個平台帶 cookie，優先使用對應的平台變數；如果想統一兜底，可以只設定 `METING_COOKIE`
