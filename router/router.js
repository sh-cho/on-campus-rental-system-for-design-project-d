module.exports = function (app) {
    //libraries
    const bcrypt = require('bcrypt-nodejs');
    const db = require('../db');
    const url = require('url');

    //vars
    let classrooms = [];

    //init works
    db.query('SELECT id, name FROM classroom', [], (err, results) => {
        if (err) throw err;
        classrooms = results;
    });



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

    app.get('/classroom_inquiry', (req, res) => {
        const sess = req.session;
        let lectures = sess.lectures;
        req.session.lectures = null;
        res.render('classroom_inquiry.pug', {
            'classrooms': classrooms,
            'lectures': lectures
        });
    });
    app.get('/classroom_reserve', (req, res) => {
        res.render('classroom_reserve.pug', {
            query: req.query
        });
    });
    app.get('/equipment_inquiry', (req, res) => {
        res.render('equipment_inquiry.pug', {
            query: req.query
        });
    });
    app.get('/equipment_reserve', (req, res) => {
        res.render('equipment_reserve.pug', {
            query: req.query
        });
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
        // delete req.session.user_idx;
        // res.redirect('/signin');

        req.session.destroy(function (err) {
            if (err) throw err;
            res.redirect('/signin');
        });
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
        db.query('SELECT * FROM `member` WHERE `email` = ?', [email], (err, result) => {
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

                    //세션에 유저 정보 저장
                    req.session.user_info = result[0];
                    res.redirect('/main');
                }
            }
        });
    });
    app.post('/signup', (req, res) => {
        const email = req.body.email;
        const id = req.body.id;
        const password = req.body.password;

        db.query('SELECT * FROM `member` WHERE `email` = ?', [email], (err, result) => {
            if (err) throw err;
            console.log("before insert");

            if (result.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                db.query('INSERT INTO `member` (id, password, type, email) VALUES (?, ?, ?, ?)',
                    [id, hash, 1, email], (err, result) => {
                    if (err) throw err;
                    console.log('추가 완료. result: ', result);
                    res.redirect(url.format({
                        pathname: '/signin',
                        query: {
                            'success': true,
                        }
                    }));
                });
            } else {
                //이미 있음
                console.log("이미 존재");
            }
        });
    });
    app.post('/classroom_inquiry', (req, res) => {
        const date = new Date(req.body.date);
        const day = date.getDay();
        let lectures = [];
        console.log("date: ", date);
        console.log("day: ", day);
        if (day===0 || day===6) {
            //pass
            console.log("pass");
            res.redirect('/classroom_inquiry');
        } else {
            db.query('SELECT * FROM `lecture` WHERE day_of_the_week & ?', [Math.pow(2, 5-day)], (err, results) => {
                console.log("res: ", results);
                console.log(typeof(results));
                lectures = results;

                const sess = req.session;
                sess.lectures = lectures;
                res.redirect('/classroom_inquiry');
            });
        }
    });
};
