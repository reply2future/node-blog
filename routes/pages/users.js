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
 * {
 *   method: 'POST',
 *   url: '/users/login'
 * }
 */
exports.postLogin = function(req, res, next){
	if(!req.body.email || !req.body.password){
		return res.render('login', { error: 'Email or Password is empty'});
	}

	req.collections.users.findOne({
		email: req.body.email,
		password: req.body.password
	}, function(error, user){
		if(error)
			return next(error);
		if(!user)
			return res.render('login', {error: 'Incorrect email and password combination.'});
		req.session.user = user;
		req.session.admin = user.admin;
		res.redirect('/users/admin');
	});
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
	req.collections.articles.find({}, {sort:{_id: -1}}).toArray(function(error, articles){
		if(error)
			return next(error);

		res.render('admin', { articles: articles });
	});
};
