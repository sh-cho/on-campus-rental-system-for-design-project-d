module.exports = function (app) {
    //libraries
    const bcrypt = require('bcrypt-nodejs');
    const db = require('../db');
    const url = require('url');
    const nodemailer = require('nodemailer');
    const mailconfig = require('../config/mail-config.json');

    //vars
    let classrooms = [];

    //init works
    db.query('SELECT id, name FROM classroom ORDER BY name', [], (err, results) => {
        if (err) throw err;
        classrooms = results;
    });

    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: mailconfig
    // });
    // let mailOptions = {
    //     from: "KHURS administrator <kcm880825@gmail.com>",
    //     to: 'seonghyeoncho96@khu.ac.kr',
    //     subject: 'nodemailer 테스트',
    //     text: '평문 보내기 테스트 123'
    // };
    // transporter.sendMail(mailOptions, (err, response) => {
    //     if (err) throw err;
    //     console.log(response);
    //     transporter.close();
    // });



    //Pug render
    app.get('/', (req, res) => {
        res.redirect('/signin');
    });
    app.get('/signin', (req, res) => {
        console.log("req.query: ", req.query);
        res.render('signin.pug', {
            query: req.query
        });
    });

    app.get('/classroom_inquiry', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
        }

        let lectures = sess.lectures;
        let rentals = sess.rentals;
        let inquiry_requested = sess.inquiry_requested;
        let inquiry_date = sess.inquiry_date;

        //remove session var
        req.session.lectures = null;
        req.session.rentals = null;
        req.session.inquiry_requested = null;
        req.session.inquiry_date = null;

        res.render('classroom_inquiry.pug', {
            'inquiry_requested': inquiry_requested,
            'inquiry_date': inquiry_date,
            'classrooms': classrooms,
            'lectures': lectures,
            'rentals': rentals
        });
    });
    app.get('/classroom_reserve', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
            return;
        }

        res.render('classroom_reserve.pug', {
            query: req.query
        });
    });
    app.get('/classroom_check', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
            return;
        }

        res.render('classroom_check.pug', {
            query: req.query
        });
    });
    app.get('/equipment_inquiry', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
            return;
        }

        res.render('equipment_inquiry.pug', {
            query: req.query
        });
    });
    app.get('/equipment_reserve', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
            return;
        }

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
        if (!sess.user_info) {
            //not logined
            res.redirect('/');
            return;
        }

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
        db.query('SELECT * FROM `member` WHERE `email` = ? LIMIT 1', [email], (err, result) => {
            if (err) throw err;
            console.log(result);

            if (result.length === 0) {
                console.log('없음');
                // res.json({success: false});
                res.redirect(url.format({
                    pathname: '/signin',
                    query: {
                        'success': false,
                        'message': 'Login failed: ID does not exist'
                    }
                }));
            } else {
                if (!bcrypt.compareSync(password, result[0].password)) {
                    console.log('비밀번호 불일치');
                    res.redirect(url.format({
                        pathname: '/signin',
                        query: {
                            'success': false,
                            'message': 'Login failed: Password Incorrect'
                        }
                    }));
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

        db.query('SELECT * FROM `member` WHERE `email` = ? LIMIT 1', [email], (err, result) => {
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
                            'message': 'Sign up success'
                        }
                    }));
                });
            } else {
                //이미 있음
                console.log("이미 존재");
                res.redirect(url.format({
                    pathname: '/signin',
                    query: {
                        'success': false,
                        'message': 'Sign up failed: ID duplicated'
                    }
                }));
            }
        });
    });
    app.post('/classroom_inquiry', (req, res) => {
        const date = new Date(req.body.date);
        const day = date.getDay();
        const sess = req.session;

        let lectures = [];
        let rentals = [];

        console.log("date: ", date);
        console.log("day: ", day);

        sess.inquiry_requested = true;
        sess.inquiry_date = date.toISOString().slice(0, 10);    //ex) "2017-12-21"

        if (day===0 || day===6) {
            //pass
            console.log("pass");
            res.redirect('/classroom_inquiry');
        } else {
            db.query('SELECT * FROM `lecture` WHERE day_of_the_week & ?', [Math.pow(2, 5-day)], (err, results) => {
                if (err) throw err;

                console.log("lectures: ", results);

                lectures = results;
                sess.lectures = lectures;

                db.query('SELECT * FROM `classroom_rental` WHERE date=?', [sess.inquiry_date], (err, results) => {
                    if (err) throw err;

                    console.log("rentals: ", results);

                    rentals = results;
                    sess.rentals = rentals;

                    res.redirect('/classroom_inquiry');
                });
            });
        }
    });
    app.post('/classroom_reserve', (req, res) => {
        const sess = req.session;

        console.log(req.body);
        console.log(sess.user_info);

        const date = req.body.date;
        const day = (new Date(date)).getDay();

        const classroomnumber = req.body.classroomnumber;
        const start_time = req.body.starttime + ":00";
        const end_time = req.body.endtime + ":00";
        const reason = req.body.reason;



        //check if duplicated lecture is exist
        db.query('SELECT * FROM lecture WHERE lecture_end_time>=? AND lecture_start_time<=? AND day_of_the_week & ? AND classroom_id=? LIMIT 1',
            [start_time, end_time, Math.pow(2, 5-day), classroomnumber], (err, results) => {
            if (err) throw err;

            if (results.length !== 0) {
                res.redirect(url.format({
                    pathname: '/classroom_reserve',
                    query: {
                        'success': false,
                        'message': 'Rental failed. It is already rented by lecture.'
                    }
                }));
            } else {
                //check if duplicated rental is exist
                //--> if (A.end_time >= B.start_time && A.start_time <= B.end_time)
                db.query('SELECT * FROM classroom_rental WHERE rental_end_time>=? AND rental_start_time<=? AND date=? AND classroom_id=? LIMIT 1',
                    [start_time, end_time, date, classroomnumber], (err, results) => {
                    console.log(results);
                    if (results.length === 0) {
                        //add to rental list
                        db.query('INSERT INTO classroom_rental (id, member_id, classroom_id, date, rental_start_time, rental_end_time, reason) VALUES (null, ?, ?, ?, ?, ?, ?)',
                            [sess.user_info.id, classroomnumber, date, start_time, end_time, reason], (err, results) => {
                            if (err) throw err;

                            res.redirect(url.format({
                                pathname: '/classroom_reserve',
                                query: {
                                    'success': true,
                                    'message': 'Rental has been completed.'
                                }
                            }));
                        });
                    } else {
                        //add to waiting list
                        db.query('INSERT INTO classroom_rental_waiting (id, member_id, classroom_id, date, rental_start_time, rental_end_time, reason) VALUES (null, ?, ?, ?, ?, ?, ?)',
                            [sess.user_info.id, classroomnumber, date, start_time, end_time, reason], (err, results) => {
                            if (err) throw err;

                            res.redirect(url.format({
                                pathname: '/classroom_reserve',
                                query: {
                                    'success': false,
                                    'message': "It's already reserved by someone else. You are registered on the waiting list."
                                }
                            }));
                        });
                    }
                });
            }
        });
    });
};
