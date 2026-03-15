import Meting from "../src/meting.js";

async function main() {
  const meting = new Meting("netease");
  meting.format(true);

  console.log("=== Meting example ===\n");

  try {
    console.log("1. Search songs");
    const searchResult = await meting.search("Hello Adele", { limit: 3 });
    const songs = JSON.parse(searchResult);
    console.log(JSON.stringify(songs, null, 2));
    console.log("");

    if (songs.length > 0) {
      const firstSong = songs[0];

      console.log(`Selected: ${firstSong.name} - ${firstSong.artist.join(", ")}`);
      console.log("");

      console.log("2. Song detail");
      const songDetail = await meting.song(firstSong.id);
      console.log(JSON.stringify(JSON.parse(songDetail), null, 2));
      console.log("");

      console.log("3. Song url");
      const urlResult = await meting.url(firstSong.url_id, 320);
      console.log(JSON.stringify(JSON.parse(urlResult), null, 2));
      console.log("");

      console.log("4. Song lyric");
      const lyricResult = await meting.lyric(firstSong.lyric_id);
      console.log(JSON.stringify(JSON.parse(lyricResult), null, 2));
      console.log("");

      console.log("5. Song picture");
      const pictureResult = await meting.pic(firstSong.pic_id, 300);
      console.log(JSON.stringify(JSON.parse(pictureResult), null, 2));
      console.log("");
    }

    console.log("6. Switch platform to tencent");
    meting.site("tencent");
    const tencentResult = await meting.search("Jay Chou", { limit: 2 });
    console.log(JSON.stringify(JSON.parse(tencentResult), null, 2));
  } catch (error) {
    console.error("Example failed:", error);
  }
}

main().catch(error => {
  console.error("Unexpected example error:", error);
});
