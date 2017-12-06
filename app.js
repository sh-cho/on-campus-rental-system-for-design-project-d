//import libraries
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');
const ejs = require('ejs');


const app = express();

//create logger (morgan)
const morgan_logger = morgan('tiny');

//server settings
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')));
app.use(express.static('public'));
app.use(morgan_logger);


const router = require('./router/router.js')(app);

//for pretty print
app.locals.pretty = true;

//create server and listen
const server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});
