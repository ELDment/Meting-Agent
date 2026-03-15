import crypto from 'crypto';
import BaseProvider from './base.js';

/**
 * 酷狗音乐平台提供者
 */
export default class KugouProvider extends BaseProvider {
  constructor(meting) {
    super(meting);
    this.name = 'kugou';
  }

  /**
   * 获取酷狗音乐的请求头配置
   */
  getHeaders() {
    return {
      'User-Agent': 'IPhone-8990-searchSong',
      'UNI-UserAgent': 'iOS11.4-Phone8990-1009-0-WiFi'
    };
  }

  /**
   * 搜索歌曲
   */
  search(keyword, option = {}) {
    return {
      method: 'GET',
      url: 'http://mobilecdn.kugou.com/api/v3/search/song',
      body: {
        api_ver: 1,
        area_code: 1,
        correct: 1,
        pagesize: option.limit || 30,
        plat: 2,
        tag: 1,
        sver: 5,
        showtype: 10,
        page: option.page || 1,
        keyword: keyword,
        version: 8990
      },
      format: 'data.info'
    };
  }

  /**
   * 获取歌曲详情
   */
  song(id) {
    return {
      method: 'POST',
      url: 'http://m.kugou.com/app/i/getSongInfo.php',
      body: {
        cmd: 'playInfo',
        hash: id,
        from: 'mkugou'
      },
      format: ''
    };
  }

  /**
   * 获取专辑信息
   */
  album(id) {
    return {
      method: 'GET',
      url: 'http://mobilecdn.kugou.com/api/v3/album/song',
      body: {
        albumid: id,
        area_code: 1,
        plat: 2,
        page: 1,
        pagesize: -1,
        version: 8990
      },
      format: 'data.info'
    };
  }

  /**
   * 获取艺术家作品
   */
  artist(id, limit = 50) {
    return {
      method: 'GET',
      url: 'http://mobilecdn.kugou.com/api/v3/singer/song',
      body: {
        singerid: id,
        area_code: 1,
        page: 1,
        plat: 0,
        pagesize: limit,
        version: 8990
      },
      format: 'data.info'
    };
  }

  /**
   * 获取播放列表
   */
  playlist(id) {
    return {
      method: 'GET',
      url: 'http://mobilecdn.kugou.com/api/v3/special/song',
      body: {
        specialid: id,
        area_code: 1,
        page: 1,
        plat: 2,
        pagesize: -1,
        version: 8990
      },
      format: 'data.info'
    };
  }

  /**
   * 获取音频播放链接
   * 有 cookie 时走新接口（songinfo + 签名），无 cookie 走老接口
   */
  url(id, br = 320) {
    const cookie = this.parseCookie(this.meting.header['Cookie'] || '');
    const hasToken = !!(cookie.t && cookie.KugooID);

    if (hasToken) {
      const now = Date.now();
      const params = {
        srcappid: '2919',
        clientver: '20000',
        clienttime: String(now),
        mid: cookie.mid || cookie.kg_mid || '',
        uuid: cookie.uuid || cookie.mid || cookie.kg_mid || '',
        dfid: cookie.dfid || cookie.kg_dfid || '',
        appid: '1014',
        platid: '4',
        hash: id,
        token: cookie.t || '',
        userid: cookie.KugooID || ''
      };

      return {
        method: 'GET',
        url: this.buildSonginfoUrl(params),
        body: null,
        decode: 'kugou_url_new'
      };
    }

    // 老接口，无需 cookie
    return {
      method: 'POST',
      url: 'http://media.store.kugou.com/v1/get_res_privilege',
      body: JSON.stringify({
        relate: 1,
        userid: '0',
        vip: 0,
        appid: 1000,
        token: '',
        behavior: 'download',
        area_code: '1',
        clientver: '8990',
        resource: [{
          id: 0,
          type: 'audio',
          hash: id
        }]
      }),
      decode: 'kugou_url_legacy'
    };
  }

  /**
   * 获取歌词
   */
  lyric(id) {
    return {
      method: 'GET',
      url: 'http://krcs.kugou.com/search',
      body: {
        keyword: '%20-%20',
        ver: 1,
        hash: id,
        client: 'mobi',
        man: 'yes'
      },
      decode: 'kugou_lyric'
    };
  }

  /**
   * 获取封面图片
   */
  async pic(id, size = 300) {
    const format = this.meting.isFormat;
    const data = await this.meting.format(false).song(id);
    this.meting.isFormat = format;
    const songData = JSON.parse(data);
    let url = songData.imgUrl;
    url = url.replace('{size}', '400');
    return JSON.stringify({ url: url });
  }

  /**
   * 格式化酷狗音乐数据
   */
  format(data) {
    const filename = data.filename || data.fileName;
    const result = {
      id: data.hash,
      name: data.songName || filename,
      artist: [],
      album: data.album_name || '',
      url_id: data.encode_album_audio_id || data.hash,
      pic_id: data.hash,
      lyric_id: data.hash,
      source: 'kugou'
    };

    if (data.authors && Array.isArray(data.authors)) {
      result.artist = data.authors.map(a => a.author_name);
    } else if (filename) {
      const parts = filename.split(' - ');
      if (parts.length >= 2) {
        result.artist = parts[0].split('、');
        result.name = parts[1];
      }
    }

    return result;
  }

  /**
   * 解析 Cookie 字符串为对象
   */
  parseCookie(cookieStr) {
    const cookies = {};
    if (!cookieStr) return cookies;
    cookieStr.split(';').forEach(pair => {
      const idx = pair.indexOf('=');
      if (idx > 0) {
        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        cookies[key] = val;
      }
    });
    return cookies;
  }

  /**
   * 生成酷狗 API 签名
   */
  getSignature(params) {
    const MD5_KEY = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';
    const paramStr = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    const sorted = paramStr.split('&').sort().join('');
    return crypto.createHash('md5').update(`${MD5_KEY}${sorted}${MD5_KEY}`).digest('hex');
  }

  /**
   * 处理酷狗音乐的解码逻辑
   */
  async handleDecode(decodeType, data) {
    if (decodeType === 'kugou_url_new') {
      return this.urlDecodeNew(data);
    } else if (decodeType === 'kugou_url_legacy') {
      return this.urlDecodeLegacy(data);
    } else if (decodeType === 'kugou_lyric') {
      return this.lyricDecode(data);
    }
    return data;
  }

  /**
   * 构建带签名的 songinfo 请求 URL
   */
  buildSonginfoUrl(params) {
    const signature = this.getSignature(params);
    const queryString = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return `https://wwwapi.kugou.com/play/songinfo?${queryString}&signature=${signature}`;
  }

  /**
   * 酷狗音乐 URL 解码（新接口，需要 cookie）
   * 第一步用 hash 查询获取 encode_album_audio_id，
   * 第二步用 encode_album_audio_id 查询获取播放链接
   */
  async urlDecodeNew(result) {
    try {
      const json = JSON.parse(result);
      const data = json.data;
      if (!data || !data.encode_album_audio_id) {
        return JSON.stringify({ url: '', size: 0, br: -1 });
      }

      // 第二步：用 encode_album_audio_id 重新查询
      const cookie = this.parseCookie(this.meting.header['Cookie'] || '');
      const now = Date.now();
      const params = {
        srcappid: '2919',
        clientver: '20000',
        clienttime: String(now),
        mid: cookie.mid || cookie.kg_mid || '',
        uuid: cookie.uuid || cookie.mid || cookie.kg_mid || '',
        dfid: cookie.dfid || cookie.kg_dfid || '',
        appid: '1014',
        platid: '4',
        encode_album_audio_id: data.encode_album_audio_id,
        token: cookie.t || '',
        userid: cookie.KugooID || ''
      };

      const api = {
        method: 'GET',
        url: this.buildSonginfoUrl(params),
        body: null
      };
      const response = JSON.parse(await this.meting._exec(api));
      const detail = response.data;
      if (detail) {
        const url = detail.play_url || detail.play_backup_url || '';
        return JSON.stringify({
          url: url,
          size: detail.filesize || 0,
          br: detail.bitrate || -1
        });
      }
    } catch (e) {
      // parse error
    }
    return JSON.stringify({ url: '', size: 0, br: -1 });
  }

  /**
   * 酷狗音乐 URL 解码（老接口，无需 cookie）
   */
  async urlDecodeLegacy(result) {
    try {
      const data = JSON.parse(result);

      let maxBr = 0;
      let url;

      for (const item of data.data[0].relate_goods) {
        if (item.info.bitrate <= this.meting.temp.br && item.info.bitrate > maxBr) {
          const api = {
            method: 'GET',
            url: 'http://trackercdn.kugou.com/i/v2/',
            body: {
              hash: item.hash,
              key: crypto.createHash('md5').update(item.hash + 'kgcloudv2').digest('hex'),
              pid: 3,
              behavior: 'play',
              cmd: '25',
              version: 8990
            }
          };

          const response = JSON.parse(await this.meting._exec(api));
          if (response.url) {
            maxBr = response.bitRate / 1000;
            url = {
              url: Array.isArray(response.url) ? response.url[0] : response.url,
              size: response.fileSize,
              br: response.bitRate / 1000
            };
          }
        }
      }

      if (url) {
        return JSON.stringify(url);
      }
    } catch (e) {
      // parse error
    }
    return JSON.stringify({ url: '', size: 0, br: -1 });
  }

  /**
   * 酷狗音乐歌词解码
   */
  async lyricDecode(result) {
    const data = JSON.parse(result);
    
    if (!data.candidates || data.candidates.length === 0) {
      return JSON.stringify({ lyric: '', tlyric: '' });
    }
    
    const api = {
      method: 'GET',
      url: 'http://lyrics.kugou.com/download',
      body: {
        charset: 'utf8',
        accesskey: data.candidates[0].accesskey,
        id: data.candidates[0].id,
        client: 'mobi',
        fmt: 'lrc',
        ver: 1
      }
    };
    
    const response = JSON.parse(await this.meting._exec(api));
    const lyricData = {
      lyric: Buffer.from(response.content, 'base64').toString(),
      tlyric: ''
    };
    
    return JSON.stringify(lyricData);
  }
}