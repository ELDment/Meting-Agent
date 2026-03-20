<p align="right"><a href="./README.md">简体中文</a> | <strong>繁體中文</strong> | <a href="./README.EN.md">English</a></p>

<p align="right"><a href="../../README.md">⬅️ 返回首頁</a></p>

# Meting-Agent

`Meting-Agent` 是基於 **[metowolf/Meting](https://github.com/metowolf/Meting)** 建構的 Skill 封裝，支援 [網易雲音樂](https://music.163.com/)（`netease`）、[騰訊音樂](https://y.qq.com/)（`tencent`）、[酷狗音樂](https://www.kugou.com/)（`kugou`）、[酷我音樂](https://www.kuwo.cn/)（`kuwo`）等音樂平台，提供搜尋、歌曲、專輯、歌手、歌單、播放連結、歌詞、封面等能力

<details>
<summary><b>執行截圖 🎨</b></summary>

![Meting-Agent Showcase](../../SHOWCASE.OPENCLAW.png)
![Meting-Agent Showcase](../../SHOWCASE.png)
</details>

## 取得

下載入口: [GitHub Releases](https://github.com/ELDment/Meting-Agent/releases)

## Cookie 規則

執行時依以下優先級取得 Cookie：

1. `METING_<PLATFORM>_COOKIE`
2. `METING_COOKIE`
3. 命令參數 `--cookie`

支援的環境變數：

- `METING_NETEASE_COOKIE`
- `METING_TENCENT_COOKIE`
- `METING_KUGOU_COOKIE`
- `METING_KUWO_COOKIE`
- `METING_COOKIE`（通用）

如果只需要替某一個平台帶 cookie，優先使用對應的平台變數；如果想統一兜底，可以只設定 `METING_COOKIE`
