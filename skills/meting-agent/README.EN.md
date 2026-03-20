<p align="right"><a href="./README.md">简体中文</a> | <a href="./README.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

<p align="right"><a href="../../README.md">⬅️ Back to Home</a></p>

# Meting-Agent

`Meting-Agent` is a Skill package built on top of **[metowolf/Meting](https://github.com/metowolf/Meting)**. It supports music platforms such as [NetEase Cloud Music](https://music.163.com/) (`netease`), [Tencent Music](https://y.qq.com/) (`tencent`), [Kugou Music](https://www.kugou.com/) (`kugou`), and [Kuwo Music](https://www.kuwo.cn/) (`kuwo`), and provides capabilities for search, songs, albums, artists, playlists, playback URLs, lyrics, and cover images.

<details>
<summary><b>Screenshot</b></summary>

![Meting-Agent Showcase](../../SHOWCASE.png)
</details>

## Download

Download from: [GitHub Releases](https://github.com/ELDment/Meting-Agent/releases)

## Cookie Rules

Cookies are resolved at runtime in this order:

1. `METING_<PLATFORM>_COOKIE`
2. `METING_COOKIE`
3. CLI argument `--cookie`

Supported environment variables:

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE` (shared fallback)

If you only need a cookie for one platform, prefer the platform-specific variable. If you want one shared fallback, set only `METING_COOKIE`.
