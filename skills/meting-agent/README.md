# Meting-Agent

`Meting-Agent` 是基于 **[metowolf/Meting](https://github.com/metowolf/Meting)** 构建的 Skills 资产，支持 [网易云音乐](https://music.163.com/)（`netease`）、[腾讯音乐](https://y.qq.com/)（`tencent`）、[酷狗音乐](https://www.kugou.com/)（`kugou`）、[千千音乐](https://music.taihe.com/)（`baidu`）、[酷我音乐](https://www.kuwo.cn/)（`kuwo`） 等音乐平台，提供搜索、歌曲、专辑、歌手、歌单、播放链接、歌词、封面等能力

## 下载

不通过 npm 发布，下载入口是 [GitHub Releases](https://github.com/ELDment/Meting-Agent/releases)

## Cookie 规则

- 优先使用 `METING_<PLATFORM>_COOKIE`
- 其次使用 `METING_COOKIE`
- 最后才使用命令参数 `--cookie`

支持的平台环境变量：

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_BAIDU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE`（通用）

如果只需要给某一个平台带 cookie，优先使用对应的平台变量；如果想统一兜底，可以只设置 `METING_COOKIE`
