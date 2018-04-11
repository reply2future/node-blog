const crypto = require('crypto');

/*
 * get login view 
 * {
 *   method: 'GET',
 *   url: '/users/login'
 * }
 */
exports.getLoginView = function(req, res, next){
	res.render('login');
};

/*
 * post login
 *
 * password add salt.
 * 
 * {
 *   method: 'POST',
 *   url: '/users/login'
 * }
 */
exports.postLogin = function(req, res, next){
	if(!req.body.email || !req.body.password){
		return res.render('login', { error: 'Email or Password is empty'});
	}

	try {
		let _user = req.db.get('users').find({
			email: req.body.email,
			password: crypto.createHash('md5').update(req.body.password).digest('hex')
		}).value();
		if(!_user)
			return res.render('login', {error: 'Incorrect email and password combination.'});
		req.session.user = _user;
		req.session.isAdmin = _user.isAdmin;
		res.redirect('/users/admin');
	} catch(error) {
		next(error);
	}
};

/*
 * logout
 * {
 *   method: 'GET',
 *   url: '/users/logout'
 * }
 */
exports.logout = function(req, res, next){
	req.session.destroy();
	res.redirect('/');
};

/*
 * get admin view
 *
 * {
 *   method: 'GET',
 *   url: '/users/admin'
 * }
 */
exports.getAdminView = function(req, res, next){
	try {
		let _articles = req.db.get('articles').value();
		res.render('admin', { articles: _articles });
	} catch(error) {
		next(error);
	}
};
