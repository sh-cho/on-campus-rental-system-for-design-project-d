const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const router = require('./router/router')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')));

const server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.use(express.static('public'));