var express = require('express');
var session = require('express-session');
var app = express();
var router = require('./router/router')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.use(express.static('public'));