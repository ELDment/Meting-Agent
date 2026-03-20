<p align="right"><strong>简体中文</strong> | <a href="./README.zh-Hant.md">繁體中文</a> | <a href="./README.EN.md">English</a></p>

<p align="right"><a href="../../README.md">⬅️ 返回主页</a></p>

# Meting-Agent

`Meting-Agent` 是基于 **[metowolf/Meting](https://github.com/metowolf/Meting)** 构建的 Skill 封装，支持 [网易云音乐](https://music.163.com/)（`netease`）、[腾讯音乐](https://y.qq.com/)（`tencent`）、[酷狗音乐](https://www.kugou.com/)（`kugou`）、[酷我音乐](https://www.kuwo.cn/)（`kuwo`）等音乐平台，提供搜索、歌曲、专辑、歌手、歌单、播放链接、歌词、封面等能力

<details>
<summary><b>运行截图</b></summary>

![Meting-Agent Showcase](../../SHOWCASE.png)
</details>

## 获取

下载入口: [GitHub Releases](https://github.com/ELDment/Meting-Agent/releases)

## Cookie 规则

运行时按以下优先级取 Cookie：

1. `METING_<PLATFORM>_COOKIE`
2. `METING_COOKIE`
3. 命令参数 `--cookie`

支持的环境变量：

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE`（通用）

如果只需要给某一个平台带 cookie，优先使用对应的平台变量；如果想统一兜底，可以只设置 `METING_COOKIE`
