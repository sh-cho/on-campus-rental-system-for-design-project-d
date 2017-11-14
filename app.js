var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
const path = require('path');
var app = express();
var router = require('./router/router')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')));

var server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.use(express.static('public'));