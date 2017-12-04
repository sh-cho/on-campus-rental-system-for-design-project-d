module.exports = function (app) {
    //Pug render
    app.get('/', (req, res) => {
        res.render('index.pug');
    });
    app.get('/pug-test', (req, res) => {
        res.render('pug-test.pug', {time: Date(), _title: 'PugPug'});
    });
    app.get('/signin', (req, res) => {
        res.render('signin.pug');
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

        //유저 찾기
        //-> 이후 구현
        req.session.user_idx = 1;

        res.redirect('/session-test');
    });
};