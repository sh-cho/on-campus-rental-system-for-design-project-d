module.exports = function (app) {
    //Pug render
    app.get('/', (req, res) => {
        res.render('index');
    });
    app.get('/pug-test', (req, res) => {
        res.render('pug-test', {time: Date(), _title: 'PugPug'});
    });
};