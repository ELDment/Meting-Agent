import Meting from "../src/meting.js";

async function runTests() {
  console.log("=== Meting smoke test ===\n");

  const platforms = ["netease", "tencent", "kugou", "baidu", "kuwo"];
  const testKeyword = "Hello Adele";

  for (const platform of platforms) {
    console.log(`\n--- Testing platform: ${platform} ---`);

    try {
      const meting = new Meting(platform);
      meting.format(true);

      console.log("Search...");
      const searchResult = await meting.search(testKeyword, { limit: 1 });
      const songs = JSON.parse(searchResult);

      if (songs.length === 0) {
        console.log("No search result");
        continue;
      }

      const firstSong = songs[0];
      console.log(`Search ok: ${firstSong.name} - ${firstSong.artist.join(", ")}`);

      console.log("Song...");
      const songResult = JSON.parse(await meting.song(firstSong.id));
      console.log(Array.isArray(songResult) && songResult.length > 0 ? "Song ok" : "Song empty");

      console.log("Url...");
      try {
        const urlResult = JSON.parse(await meting.url(firstSong.url_id, 128));
        console.log(urlResult.url ? "Url ok" : "Url unavailable");
      } catch (error) {
        console.log("Url failed:", error.message);
      }

      console.log("Lyric...");
      try {
        const lyricResult = JSON.parse(await meting.lyric(firstSong.lyric_id));
        console.log(lyricResult.lyric ? "Lyric ok" : "Lyric unavailable");
      } catch (error) {
        console.log("Lyric failed:", error.message);
      }

      console.log("Picture...");
      try {
        const pictureResult = JSON.parse(await meting.pic(firstSong.pic_id, 200));
        console.log(pictureResult.url ? "Picture ok" : "Picture unavailable");
      } catch (error) {
        console.log("Picture failed:", error.message);
      }
    } catch (error) {
      console.log(`Platform ${platform} failed:`, error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n=== Smoke test finished ===");
}

runTests().catch((error) => {
  console.error("Unexpected test failure:", error);
  process.exitCode = 1;
});
