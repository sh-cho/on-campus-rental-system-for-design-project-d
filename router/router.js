module.exports = function (app) {
    const bcrypt = require('bcrypt-nodejs');
    const db = require('../db');
    const url = require('url');

    //Pug render
    app.get('/', (req, res) => {
        res.render('index.pug');
    });
    app.get('/pug-test', (req, res) => {
        res.render('pug-test.pug', {time: Date(), _title: 'PugPug'});
    });
    app.get('/signin', (req, res) => {
        console.log("req.query: ", req.query);
        res.render('signin.pug', {
            query: req.query
        });
    });
    app.get('/session-test', (req, res) => {
        // console.log('req:', req);
        // console.log('res:', res);

        const sess = req.session;
        res.render('session-test.pug', {
            // nickname: sess.user_uid+1 ? app.users[sess.user_uid]['user_nickname'] : ''
            nickname: 'abc',
            idx: sess.user_idx
        });
    });
    app.get('/inquiry', (req, res) => {
        res.render('inquiry.pug');
    });
    app.get('/signup', (req, res) => {
        res.render('signup.pug');
    });
    app.get('/main', (req, res) => {
        //DEBUG: session 변수 전부 출력
        const sess = req.session;
        res.render('main.pug', {
            session: sess
        });
    });


    //logout
    app.get('/logout', (req, res) => {
        delete req.session.user_idx;
        res.redirect('/');
    });


    //html render
    app.get('/html-test', (req, res) => {
        res.render('html-test.html');
    });


    //POST handle
    app.post('/signin', (req, res) => {
        const body = req.body;
        console.log(body);

        const email = req.body.email;
        const password = req.body.password;

        //유저 찾기
        // req.session.user_idx = 1;
        db.query('SELECT * FROM `member` WHERE `email` = ?', email, (err, result) => {
            if (err) throw err;
            console.log(result);

            if (result.length === 0) {
                console.log('없음');
                res.json({success: false});
            } else {
                if (!bcrypt.compareSync(password, result[0].password)) {
                    console.log('비밀번호 불일치');
                } else {
                    console.log('로그인 성공');
                    res.redirect('/main');
                }
            }
        });

        // res.redirect('/session-test');
    });
    app.post('/signup', (req, res) => {
        const email = req.body.email;
        const id = req.body.id;
        const password = req.body.password;

        db.query('SELECT * FROM `member` WHERE `email` = ?', email, (err, result) => {
            if (err) throw err;
            console.log("before insert");

            if (result.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                db.query('INSERT INTO `member` (id, password, type, email) VALUES (?, ?, ?, ?)',
                    [id, hash, 1, email], (err, result) => {
                    if (err) throw err;
                    console.log('추가 완료. result: ', result);
                    // res.redirect('/signin?success=true');
                    res.redirect(url.format({
                        pathname: '/signin',
                        query: {
                            'success': true
                        }
                    }));
                });
            } else {
                //이미 있음
                console.log("이미 존재");
            }
        });
    });
};
