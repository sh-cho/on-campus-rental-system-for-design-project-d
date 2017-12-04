module.exports = function (app) {
    //Pug render
    app.get('/', (req, res) => {
        res.render('index.pug');
    });
    app.get('/pug-test', (req, res) => {
        res.render('pug-test.pug', {time: Date(), _title: 'PugPug'});
    });
    app.get('/login', (req, res) => {
        res.render('login.pug');
    });
    app.get('/session-test', (req, res) => {
        const sess = req.session;
        res.render('session-test.pug', {
            // nickname: sess.user_uid+1 ? app.users[sess.user_uid]['user_nickname'] : ''
            nickname: 'abc'
        });
    });

    //html render
    app.get('/html-test', (req, res) => {
        res.render('html-test.html');
    });
};