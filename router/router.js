module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index.html');
	});
	app.get('/test', function (req, res) {
		res.render('test.html');
	});
    app.get('/login', function (req, res) {
        res.render('login.html');
    });
    app.get('/inquiry', function (req, res) {
        res.render('inquiry.html');
    });
};
