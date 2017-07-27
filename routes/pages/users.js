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
 * {
 *   method: 'POST',
 *   url: '/users/login'
 * }
 */
exports.postLogin = function(req, res, next){
	res.redirect('/');
};

/*
 * logout
 * {
 *   method: 'GET',
 *   url: '/users/logout'
 * }
 */
exports.logout = function(req, res, next){
	res.redirect('/');
};
