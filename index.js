const download = require('./download');
const search = require('./search');
const express = require('express');
const app = express();
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFIle('./public/index.html');
});
app.listen(3000);