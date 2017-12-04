//import libraries
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');
const ejs = require('ejs');

const app = express();
const router = require('./router/router.js')(app);

//create new logger (morgan)
const mylogger = morgan('tiny');

//server settings
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')));
app.use(express.static('public'));
app.use(mylogger);


const users = [
    {
        user_id: 'hyeok',
        user_nickname: '혁',
        user_pwd: '123456'
    },
    {
        user_id: 'hyc7575',
        user_nickname: '에이치',
        user_pwd: '1q2w3e4r'
    }
];


//for pretty print
app.locals.pretty = true;

//create server and listen
const server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});
