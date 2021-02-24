const download = require('./download');
const search = require('./search');
const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/api/search', (req, res) => {
  // if (req.headers.token != 'lemkocecoàsàpskkskskks') {

  //   res.status(403).json({
  //     error: 'invalid token bro'
  //   });
  //   return;

  // }
  search(req.query.songName).then(info => {
    console.log(info);
    res.json(info);
  }).catch(err => {
    console.log(err);
    res.json({
      error: 'paila'
    });
  });
});

app.get('/', (req, res) => {
  res.sendFIle('./public/index.html');
});

app.listen(3000);