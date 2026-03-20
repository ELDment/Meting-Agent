import Meting from "../shared/meting/meting.js";

const supportedPlatforms = ["netease", "tencent", "kugou", "baidu", "kuwo"];
const previewLength = 512;
const defaultKeyword = "我怀念的";
const cookieEnvNames = Object.freeze({
  netease: "METING_NETEASE_COOKIE",
  tencent: "METING_TENCENT_COOKIE",
  kugou: "METING_KUGOU_COOKIE",
  baidu: "METING_BAIDU_COOKIE",
  kuwo: "METING_KUWO_COOKIE",
});

function ReadEnvValue(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function ResolveCookie(platform) {
  const platformCookieName = cookieEnvNames[platform];
  const platformCookie = platformCookieName ? ReadEnvValue(platformCookieName) : undefined;
  const fallbackCookie = ReadEnvValue("METING_COOKIE");

  if (platformCookie) {
    return { source: platformCookieName, value: platformCookie };
  }

  if (fallbackCookie) {
    return { source: "METING_COOKIE", value: fallbackCookie };
  }

  return null;
}

function ParseCookieString(cookieText) {
  const cookieMap = new Map();

  for (const cookiePart of (cookieText || "").split(";")) {
    const trimmedPart = cookiePart.trim();
    const separatorIndex = trimmedPart.indexOf("=");

    if (!trimmedPart || separatorIndex <= 0) {
      continue;
    }

    cookieMap.set(
      trimmedPart.slice(0, separatorIndex).trim(),
      trimmedPart.slice(separatorIndex + 1).trim()
    );
  }

  return cookieMap;
}

function MergeCookieStrings(baseCookie, extraCookie) {
  const mergedCookieMap = ParseCookieString(baseCookie);

  for (const [name, value] of ParseCookieString(extraCookie)) {
    mergedCookieMap.set(name, value);
  }

  return Array.from(mergedCookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function GetPreview(value, maxLength = previewLength) {
  const text =
    typeof value === "string"
      ? value
      : (() => {
          try {
            return JSON.stringify(value);
          } catch {
            return String(value);
          }
        })();

  const singleLineText = text.replace(/\s+/g, " ").trim();
  return singleLineText.length > maxLength
    ? `${singleLineText.slice(0, maxLength)}...`
    : singleLineText;
}

function LogPreview(label, value) {
  console.log(`${label}: ${GetPreview(value) || "(empty)"}`);
}

function CreateClient(platform) {
  const meting = new Meting(platform);
  meting.format(true);

  const resolvedCookie = ResolveCookie(platform);
  if (!resolvedCookie) {
    console.log("Cookie source: none");
    return meting;
  }

  meting.cookie(MergeCookieStrings(meting.header.Cookie, resolvedCookie.value));
  console.log(`Cookie source: ${resolvedCookie.source}`);
  return meting;
}

async function RunJsonRequest(label, request, options = {}) {
  const {
    getStatus = () => `${label} ok`,
    getDetail,
    detailLabel = "detail",
    failLabel = `${label} failed`,
  } = options;

  console.log(`${label}...`);

  try {
    const raw = await request();
    LogPreview(`${label} raw`, raw);

    const result = JSON.parse(raw);
    console.log(getStatus(result));

    // const detail = getDetail ? getDetail(result) : result;
    // if (detail !== undefined) {
    //   LogPreview(`${label} ${detailLabel}`, detail);
    // }

    return result;
  } catch (error) {
    console.log(`${failLabel}:`, error.message);
    return null;
  }
}

async function RunPlatformTest(platform, testKeyword) {
  console.log(`--- Testing platform: ${platform} ---`);

  try {
    const meting = CreateClient(platform);
    const songs = await RunJsonRequest("Search", () => meting.search(testKeyword, { limit: 1 }), {
      getStatus(result) {
        if (result.length === 0) {
          return "No search result";
        }

        const firstSong = result[0];
        return `Search ok: ${firstSong.name} - ${firstSong.artist.join(", ")}`;
      },
      getDetail(result) {
        return result[0];
      },
      detailLabel: "first",
    });

    if (!songs || songs.length === 0) {
      return;
    }

    const firstSong = songs[0];

    await RunJsonRequest("Song", () => meting.song(firstSong.id), {
      getStatus(result) {
        return Array.isArray(result) && result.length > 0 ? "Song ok" : "Song empty";
      },
      getDetail(result) {
        return Array.isArray(result) && result.length > 0 ? result[0] : undefined;
      },
      detailLabel: "first",
    });

    await RunJsonRequest("Url", () => meting.url(firstSong.url_id, 128), {
      getStatus(result) {
        return result.url ? "Url ok" : "Url unavailable";
      },
    });

    await RunJsonRequest("Lyric", () => meting.lyric(firstSong.lyric_id), {
      getStatus(result) {
        return result.lyric ? "Lyric ok" : "Lyric unavailable";
      },
    });

    await RunJsonRequest("Picture", () => meting.pic(firstSong.pic_id, 200), {
      getStatus(result) {
        return result.url ? "Picture ok" : "Picture unavailable";
      },
    });
  } catch (error) {
    console.log(`Platform ${platform} failed:`, error.message);
  }
}

async function RunTests() {
  console.log("=== Meting smoke test ===\n");

  const platform = process.argv[2];
  const keywordArgument = process.argv.slice(3).join(" ").trim();
  const testKeyword = keywordArgument || defaultKeyword;
  const platforms = platform ? [platform] : supportedPlatforms;

  for (const platformName of platforms) {
    await RunPlatformTest(platformName, testKeyword);

    if (platforms.length > 1 && platformName !== platforms[platforms.length - 1]) {
      console.log("");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log("\n=== Smoke test finished ===");
}

RunTests().catch((error) => {
  console.error("Unexpected test failure:", error);
  process.exitCode = 1;
});
