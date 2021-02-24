var YouTube = require('youtube-node');

var youTube = new YouTube();
youTube.setKey('AIzaSyApL-gakoPM4oG7UG6ah2wpXONgLglbI44');
youTube.addParam('type', 'video');

const search = (query) => {
  return new Promise((resolve, reject) => {
    if (!query) {
      reject('NOT TERM SELECTED')
      return;
    }
    youTube.search(query, 5, function (error, result) {
      if (error) {
        reject(error);
      } else {
        const list = result.items.map(item => {
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            url: item.snippet.thumbnails.default.url
          }
        });
        resolve(list);
      }
    });
  })
}
module.exports = search;