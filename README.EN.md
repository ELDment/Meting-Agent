<p align="right"><a href="./README.md">简体中文</a> | <a href="./README.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

# Meting-Agent

`Meting-Agent` is a multi-platform music capability package built on top of **[metowolf/Meting](https://github.com/metowolf/Meting)**. It is currently delivered in two forms:

- **MCP**: [@eldment/meting-agent](https://www.npmjs.com/package/@eldment/meting-agent)
- **Skill**: [skills/meting-agent](https://github.com/ELDment/Meting-Agent/releases)

<details>
<summary><b>Screenshot 🎨</b></summary>

![Meting-Agent Showcase](./SHOWCASE.OPENCLAW.png)
![Meting-Agent Showcase](./SHOWCASE.png)
</details>

## Features

Unified interface:

- `search`: Search songs, albums, artists, or platform-specific resources by keyword
- `song`: Get song details by song ID
- `album`: Get album details by album ID
- `artist`: Get an artist's works by artist ID
- `playlist`: Get playlist details by playlist ID
- `url`: Get a playable URL by song ID
- `lyric`: Get lyrics by song ID
- `pic`: Get a cover or image URL by resource ID

Supported platforms: [NetEase Cloud Music](https://music.163.com/) (`netease`), [Tencent Music](https://y.qq.com/) (`tencent`), [Kugou Music](https://www.kugou.com/) (`kugou`), [Kuwo Music](https://www.kuwo.cn/) (`kuwo`)

## Docs

- MCP setup: [mcp/README.EN.md](./mcp/README.EN.md)
- Skill setup: [skills/meting-agent/README.EN.md](./skills/meting-agent/README.EN.md)
- Contribution workflow and sync mechanism: [docs/CONTRIBUTING.EN.md](./docs/CONTRIBUTING.EN.md)

## Acknowledgements

Thanks to **[metowolf/Meting](https://github.com/metowolf/Meting)** for the cross-platform unified interface and provider implementations.

---

Keywords: MCP Server | Model Context Protocol | Music API | Node.js MCP | AI Tool Integration | AI Skills | Reusable Skills | NetEase Cloud Music | Tencent QQ Music | KuGou Music | Kuwo Music | Lyrics API | Playlist API
