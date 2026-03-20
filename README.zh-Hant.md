<p align="right"><a href="./README.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./README.EN.md">English</a></p>

# Meting-Agent

`Meting-Agent` 是基於 **[metowolf/Meting](https://github.com/metowolf/Meting)** 建構的多平台音樂能力封裝，目前提供兩類交付物：

- **MCP**：[@eldment/meting-agent](https://www.npmjs.com/package/@eldment/meting-agent)
- **Skill**：[skills/meting-agent](https://github.com/ELDment/Meting-Agent/releases)

<details>
<summary><b>執行截圖 🎨</b></summary>

![Meting-Agent Showcase](./SHOWCASE.OPENCLAW.png)
![Meting-Agent Showcase](./SHOWCASE.png)
</details>

## 功能

統一介面：

- `search`：依關鍵字搜尋歌曲、專輯、歌手或平台特定資源
- `song`：依歌曲 ID 取得歌曲詳情
- `album`：依專輯 ID 取得專輯詳情
- `artist`：依歌手 ID 取得歌手作品清單
- `playlist`：依歌單 ID 取得歌單詳情
- `url`：依歌曲 ID 取得可播放連結
- `lyric`：依歌曲 ID 取得歌詞內容
- `pic`：依資源 ID 取得封面或圖片連結

支援平台：[網易雲音樂](https://music.163.com/)（`netease`）、[騰訊音樂](https://y.qq.com/)（`tencent`）、[酷狗音樂](https://www.kugou.com/)（`kugou`）、[酷我音樂](https://www.kuwo.cn/)（`kuwo`）

## 文件

- MCP 設定說明見 [mcp/README.zh-Hant.md](./mcp/README.zh-Hant.md)
- Skill 設定說明見 [skills/meting-agent/README.zh-Hant.md](./skills/meting-agent/README.zh-Hant.md)
- 貢獻流程與同步機制（編譯時報錯）說明見 [docs/CONTRIBUTING.zh-Hant.md](./docs/CONTRIBUTING.zh-Hant.md)

## 致謝

感謝 **[metowolf/Meting](https://github.com/metowolf/Meting)** 提供跨平台統一介面與各平台 provider 實作

---

關鍵詞: MCP Server | Model Context Protocol | Music API | Node.js MCP | AI Tool Integration | AI Skills | Reusable Skills | NetEase Cloud Music | Tencent QQ Music | KuGou Music | Kuwo Music | Lyrics API | Playlist API
