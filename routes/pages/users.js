const crypto = require('crypto')

/*
 * get login view
 * {
 *   method: 'GET',
 *   url: '/users/login'
 * }
 */
exports.getLoginView = (req, res) => {
  res.render('login')
}

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
exports.postLogin = (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.render('login', { error: 'Email or Password is empty' })
    }

    if (req.body.password.length !== 32) {
      req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex')
    }

    const _user = req.db.get('users').find({
      email: req.body.email,
      password: req.body.password
    }).value()
    if (!_user) {
      return res.render('login', { error: 'Incorrect email and password combination.' })
    }
    req.session.user = _user
    req.session.isAdmin = _user.isAdmin
    res.redirect('/users/admin')
  } catch (error) {
    next(error)
  }
}

/*
 * logout
 * {
 *   method: 'GET',
 *   url: '/users/logout'
 * }
 */
exports.logout = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

/*
 * get admin view
 *
 * {
 *   method: 'GET',
 *   url: '/users/admin'
 * }
 */
exports.getAdminView = (req, res, next) => {
  try {
    const _articles = req.db.get('articles').value()
    res.render('admin', { articles: _articles })
  } catch (error) {
    next(error)
  }
}
