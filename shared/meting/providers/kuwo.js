import BaseProvider from "./base.js";

/**
 * 酷我音乐平台提供者
 */
export default class KuwoProvider extends BaseProvider {
  constructor(meting) {
    super(meting);
    this.name = "kuwo";
  }

  /**
   * 获取酷我音乐的请求头配置
   */
  getHeaders() {
    return {
      Cookie:
        "Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1623339177,1623339183; _ga=GA1.2.1195980605.1579367081; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1623339982; kw_token=3E7JFQ7MRPL; _gid=GA1.2.747985028.1623339179; _gat=1",
      csrf: "3E7JFQ7MRPL",
      Referer: "https://www.kuwo.cn/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    };
  }

  /**
   * 搜索歌曲
   */
  search(keyword, option = {}) {
    return {
      method: "GET",
      url: "https://www.kuwo.cn/search/searchMusicBykeyWord",
      body: {
        vipver: 1,
        client: "kt",
        ft: "music",
        cluster: 0,
        strategy: 2012,
        encoding: "utf8",
        rformat: "json",
        mobi: 1,
        issubtitle: 1,
        show_copyright_off: 1,
        pn: Math.max((option.page || 1) - 1, 0),
        rn: option.limit || 30,
        all: keyword,
      },
      format: "abslist",
    };
  }

  /**
   * 获取歌曲详情
   */
  song(id) {
    this.meting.temp.kuwoSongId = id;
    return {
      ...this.createSongInfoAndLyricApi(id),
      decode: "kuwo_song",
      format: "",
    };
  }

  /**
   * 获取专辑信息
   */
  album(id) {
    return {
      method: "GET",
      url: "http://www.kuwo.cn/api/www/album/albumInfo",
      body: {
        albumId: id,
        pn: 1,
        rn: 1000,
        httpsStatus: 1,
      },
      format: "data.musicList",
    };
  }

  /**
   * 获取艺术家作品
   */
  artist(id, limit = 50) {
    return {
      method: "GET",
      url: "http://www.kuwo.cn/api/www/artist/artistMusic",
      body: {
        artistid: id,
        pn: 1,
        rn: limit,
        httpsStatus: 1,
      },
      format: "data.list",
    };
  }

  /**
   * 获取播放列表
   */
  playlist(id) {
    return {
      method: "GET",
      url: "http://www.kuwo.cn/api/www/playlist/playListInfo",
      body: {
        pid: id,
        pn: 1,
        rn: 1000,
        httpsStatus: 1,
      },
      format: "data.musicList",
    };
  }

  /**
   * 获取音频播放链接
   */
  url(id, br = 320) {
    const rid = String(id).startsWith("MUSIC_") ? id : `MUSIC_${id}`;
    return {
      method: "GET",
      url: "https://antiserver.kuwo.cn/anti.s",
      body: {
        type: "convert_url3",
        rid: rid,
        format: "mp3",
        response: "url",
      },
      decode: "kuwo_url",
    };
  }

  /**
   * 获取歌词
   */
  lyric(id) {
    this.meting.temp.kuwoLyricId = id;
    return {
      ...this.createSongInfoAndLyricApi(id),
      decode: "kuwo_lyric",
    };
  }

  /**
   * 获取封面图片
   */
  async pic(id, size = 300) {
    const songData = await this.fetchSongInfoAndLyric(id);
    const info = this.pickSongInfo(songData);
    const url = info.pic || info.albumpic || "";
    return JSON.stringify({ url: url });
  }

  /**
   * 格式化酷我音乐数据
   */
  format(data) {
    const songData = this.pickSongInfo(data);
    const lyricList = this.pickLyricList(data);
    const rawId =
      songData.rid ||
      songData.musicrid ||
      songData.musicrId ||
      songData.DC_TARGETID ||
      songData.MUSICRID ||
      songData.id ||
      "";
    const id = typeof rawId === "string" ? rawId.replace(/^MUSIC_/, "") : rawId;
    let name = songData.name || songData.songName || songData.SONGNAME || songData.NAME || "";
    let artist = songData.artist || songData.ARTIST || songData.FARTIST || "";
    const album = songData.album || songData.albumName || songData.ALBUM || "";

    if ((!name || !artist) && lyricList.length > 0 && lyricList[0].lineLyric) {
      const firstLine = lyricList[0].lineLyric.trim();
      const separatorIndex = firstLine.lastIndexOf("-");
      if (separatorIndex > 0) {
        name = name || firstLine.slice(0, separatorIndex).trim();
        artist = artist || firstLine.slice(separatorIndex + 1).trim();
      }
    }

    return {
      id: id,
      name: name,
      artist: artist ? artist.split("&") : [],
      album: album,
      pic_id: id,
      url_id: id,
      lyric_id: id,
      source: "kuwo",
    };
  }

  /**
   * 处理酷我音乐的解码逻辑
   */
  async handleDecode(decodeType, data) {
    if (decodeType === "kuwo_song") {
      return this.songDecode(data);
    } else if (decodeType === "kuwo_url") {
      return this.urlDecode(data);
    } else if (decodeType === "kuwo_lyric") {
      return this.lyricDecode(data);
    }
    return data;
  }

  /**
   * 酷我音乐 URL 解码
   */
  urlDecode(result) {
    const data = JSON.parse(result);

    let url;
    if (data.code === 200 && data.url) {
      url = {
        url: data.url,
        br: this.meting.temp.br || 128,
      };
    } else if (data.code === 200 && data.data && data.data.url) {
      url = {
        url: data.data.url,
        br: 128,
      };
    } else {
      url = {
        url: "",
        br: -1,
      };
    }

    return JSON.stringify(url);
  }

  /**
   * 酷我音乐歌词解码
   */
  async lyricDecode(result) {
    let data = JSON.parse(result);

    if (!this.hasLyricData(data) && this.meting.temp.kuwoLyricId) {
      data = (await this.fetchSongInfoAndLyric(this.meting.temp.kuwoLyricId, data)) || data;
    }

    let lyric = "";
    if (this.hasLyricData(data)) {
      this.pickLyricList(data).forEach((item) => {
        const time = parseFloat(item.time);
        const min = Math.floor(time / 60)
          .toString()
          .padStart(2, "0");
        const sec = Math.floor(time % 60)
          .toString()
          .padStart(2, "0");
        const msec = ((time % 1) * 100).toFixed(0).padStart(2, "0");

        lyric += `[${min}:${sec}.${msec}]${item.lineLyric}\n`;
      });
    }

    const lyricData = {
      lyric: lyric,
      tlyric: "",
    };

    return JSON.stringify(lyricData);
  }

  async songDecode(result) {
    let data = JSON.parse(result);

    if (!this.hasSongInfoData(data) && this.meting.temp.kuwoSongId) {
      data = (await this.fetchSongInfoAndLyric(this.meting.temp.kuwoSongId, data)) || data;
    }

    return JSON.stringify(data.data || {});
  }

  async fetchSongInfoAndLyric(id, fallback = null) {
    const requestVariants = [
      {
        musicId: id,
        httpsStatus: 1,
      },
      {
        musicId: id,
        from: "web",
      },
      {
        musicId: id,
      },
    ];

    const headers = this.getMobileHeaders();
    let mergedData = fallback && fallback.data ? fallback : null;

    for (let attempt = 0; attempt < 3; attempt++) {
      for (const query of requestVariants) {
        try {
          const url =
            "https://m.kuwo.cn/newh5/singles/songinfoandlrc?" +
            new URLSearchParams(query).toString();
          await this.meting._curl(url, null, false, headers);
          const data = JSON.parse(this.meting.raw);
          if (this.hasSongInfoData(data) || this.hasLyricData(data)) {
            mergedData = this.mergeSongInfoAndLyricData(mergedData, data);
            const mergedSongInfo = this.pickSongInfo(mergedData);
            if (mergedSongInfo.songName && mergedSongInfo.pic && this.hasLyricData(mergedData)) {
              return mergedData;
            }
          }
        } catch (error) {
          // ignore parse/request errors and try the next variant
        }
      }
    }

    return mergedData || fallback;
  }

  mergeSongInfoAndLyricData(base, incoming) {
    if (!base) {
      return incoming;
    }

    const merged = {
      ...base,
      data: {
        ...(base.data || {}),
        ...(incoming.data || {}),
        songinfo: {
          ...(base.data?.songinfo || {}),
          ...(incoming.data?.songinfo || {}),
        },
      },
    };

    for (const [key, value] of Object.entries(base.data?.songinfo || {})) {
      if (
        merged.data.songinfo[key] === undefined ||
        merged.data.songinfo[key] === null ||
        merged.data.songinfo[key] === ""
      ) {
        merged.data.songinfo[key] = value;
      }
    }

    if (
      (!merged.data.lrclist || merged.data.lrclist.length === 0) &&
      base.data?.lrclist?.length > 0
    ) {
      merged.data.lrclist = base.data.lrclist;
    }

    return merged;
  }

  createSongInfoAndLyricApi(id) {
    return {
      method: "GET",
      url: "https://m.kuwo.cn/newh5/singles/songinfoandlrc",
      body: {
        musicId: id,
        httpsStatus: 1,
      },
      headers: this.getMobileHeaders(),
    };
  }

  getMobileHeaders() {
    return {
      Cookie: "",
      Referer: "https://m.kuwo.cn/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    };
  }

  pickSongInfo(data) {
    return data?.data?.songinfo || data?.songinfo || data?.data || data || {};
  }

  pickLyricList(data) {
    return data?.data?.lrclist || data?.lrclist || [];
  }

  hasSongInfoData(data) {
    return !!this.pickSongInfo(data).id;
  }

  hasLyricData(data) {
    return this.pickLyricList(data).length > 0;
  }
}
