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

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: mailconfig
    });




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

        let rentals = [];
        let rental_waitings = [];

        db.query('SELECT cr.id, cl.name as classroom_name, cr.classroom_id, cr.member_id, cr.date, cr.rental_start_time, cr.rental_end_time, cr.reason FROM classroom_rental as cr, classroom as cl WHERE cl.id = cr.classroom_id AND cr.member_id=?', [sess.user_info.id], (err, results) => {
            if (err) throw err;
            rentals = results;

            db.query('SELECT cr.id, cl.name as classroom_name, cr.classroom_id, cr.member_id, cr.date, cr.rental_start_time, cr.rental_end_time, cr.reason FROM classroom_rental_waiting as cr, classroom as cl WHERE cl.id = cr.classroom_id AND cr.member_id=?', [sess.user_info.id], (err, results) => {
                if (err) throw err;
                rental_waitings = results;

                res.render('classroom_check.pug', {
                    session: sess,
                    query: req.query,
                    'rentals': rentals,
                    'rental_waitings': rental_waitings
                });
            });
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
    app.get('/equipment_check', (req, res) => {
        const sess = req.session;
        if (!sess.user_info) {
            res.redirect('/');
            return;
        }

        res.render('equipment_check.pug', {
            session: sess,
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
    app.get('/admin', (req, res) => {
        // res.render('admin.pug');
        let rentals = [];
        let rental_waitings = [];

        db.query('SELECT cr.id, cl.name as classroom_name, cr.classroom_id, cr.member_id, cr.date, cr.rental_start_time, cr.rental_end_time, cr.reason FROM classroom_rental as cr, classroom as cl WHERE cl.id = cr.classroom_id', [], (err, results) => {
            if (err) throw err;
            rentals = results;

            db.query('SELECT cr.id, cl.name as classroom_name, cr.classroom_id, cr.member_id, cr.date, cr.rental_start_time, cr.rental_end_time, cr.reason FROM classroom_rental_waiting as cr, classroom as cl WHERE cl.id = cr.classroom_id', [], (err, results) => {
                if (err) throw err;
                rental_waitings = results;

                // console.log(rentals);
                // console.log(rental_waitings);

                res.render('admin.pug', {
                    query: req.query,
                    'rentals': rentals,
                    'rental_waitings': rental_waitings
                });
            });
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

                    //admin check
                    if (req.session.user_info.type===1) {
                        res.redirect('/main');
                    } else {
                        res.redirect('/admin');
                    }
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
    app.post('/classroom_check', (req, res) => {
        console.log(req.body);

        const rental_id = req.body.rental_id;
        const date = req.body.date;
        const classroom_id = req.body.classroom_id;
        const start_time = req.body.rental_start_time;
        const end_time = req.body.rental_end_time;

        db.query('DELETE FROM classroom_rental WHERE id=? AND 1=0', [rental_id], (err, results) => {
            if (err) throw err;

            //check waiting lists
            db.query('SELECT mb.email FROM classroom_rental_waiting as cr, member as mb WHERE cr.rental_end_time >= ? AND cr.rental_start_time <= ? AND cr.date = ? AND cr.classroom_id = ? AND cr.member_id = mb.id',
                [start_time, end_time, date, classroom_id], (err, results) => {
                if (err) throw err;
                console.log("emails: ", results);

                //waiting exists
                if (results.length !== 0) {
                    //send mail
                    let emails = [];
                    for (const row in results) {
                        emails.push(results[row].email);
                    }

                    let mailOptions = {
                        from: "KHURS administrator <kcm880825@gmail.com>",
                        bcc: emails,
                        subject: '강의실 공석이 발생했습니다',
                        text: date+'일 '+start_time+"~"+end_time+"에 예약된 강의실 대여가 취소되었습니다. KHURS 홈페이지에서 공석을 확인해주세요"
                    };
                    transporter.sendMail(mailOptions, (err, response) => {
                        if (err) throw err;
                        console.log(response);
                        transporter.close();
                    });
                }

                res.redirect(url.format({
                    pathname: '/classroom_check',
                    query: {
                        'success': true,
                        'message': 'Canceled successfully.'
                    }
                }));
            });
        });
    });
};
