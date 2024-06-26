const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000,'192.168.10.19', () => {
    console.log('Server listening on port 3000');
  });