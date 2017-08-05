const express = require('express'),
	  mongoskin = require('mongoskin'),
	  http = require('http'),
	  path = require('path'),
	  logger = require('morgan'),
	  cookieParser = require('cookie-parser'),
	  bodyParser = require('body-parser'),
	  session = require('express-session');

const routes = require('./routes/exports'),
	  pages = routes.pages,
	  api = routes.api;

const app = express();
app.locals.appTitle = 'node-blog';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'your cookie secret'));
app.use(session({
	secret: process.env.SESSION_SECRET || 'your session secret',
	resave: false,
	saveUninitialized: false
}));
// through docker --link the mongodb container
// access mongodb using docker container alias
const dbUrl = process.env.MONGOHQ_URL || 'mongodb://mongodb:27017/blog',
	  db = mongoskin.db(dbUrl),
	  collections = {
		  articles: db.collection('articles'),
		  users: db.collection('users')
	  };

// load data
app.use(function(req, res, next){
	if(!collections.articles || !collections.users)
		return next(new Error('No collections.'));

	req.collections = collections;
	return next();
});

// Authentication
app.use(function(req, res, next){
	if(req.session && req.session.admin)
		res.locals.admin = true;
	next();
});

const authorize = function(req, res, next){
	if(req.session && req.session.admin)
		return next();
	else
		return res.sendStatus(401);
};

debugger

// page routes
app.get(['/', '/index'], pages.index.getIndexView);
app.get('/users/login', pages.users.getLoginView);
app.post('/users/login', pages.users.postLogin);
app.get('/users/logout', pages.users.logout);
app.get('/articles/post', authorize, pages.articles.getPostView);
app.post('/articles/post', authorize, pages.articles.postArticle);
app.get('/articles/admin', authorize, pages.articles.getAdminView);
app.get('/articles/:slug', pages.articles.getArticleBySlug);


// RESTful api
app.put('/api/articles/:id', api.articles.editArticleById);
app.delete('/api/articles/:id', api.articles.delArticleById);
app.get('/api/articles', api.articles.getAllArticles);
app.post('/api/articles', api.articles.postArticle);

app.use(function(req, res){
	res.sendStatus(404);
});
module.exports = app;


