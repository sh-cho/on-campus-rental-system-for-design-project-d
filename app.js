//import libraries
const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');

const app = express();
const router = require('./router/router.js')(app);

//create new logger (morgan)
const mylogger = morgan('tiny');

//server settings
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')));
app.use(express.static('public'));
app.use(mylogger);

//create server and listen
const server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});
