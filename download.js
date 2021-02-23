var YoutubeMp3Downloader = require("youtube-mp3-downloader");



const download = (id) => {
  return new Promise((resolve, reject) => {


    //Configure YoutubeMp3Downloader with your settings
    var YD = new YoutubeMp3Downloader({
      "ffmpegPath": "/Users/danielmartinez/ffmpeg_lib", // FFmpeg binary location
      "outputPath": "./public/sound", // Output file location (default: the home directory)
    });


    YD.download(id, `${id}.mp3`);

    YD.on("finished", function (err, data) {

      if (err) {
        reject(err)
      } else {
        resolve(data);
      }
    });

    YD.on("error", function (error) {
      reject(error);
    });
  })
}
module.exports = download;