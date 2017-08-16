const express = require('express'),
	  mongoskin = require('mongoskin'),
	  http = require('http'),
	  path = require('path'),
	  logger = require('morgan'),
	  cookieParser = require('cookie-parser'),
	  bodyParser = require('body-parser'),
	  session = require('express-session'),
	  FileStore = require('session-file-store')(session),
	  compression = require('compression');

const routes = require('./routes/exports'),
	  pages = routes.pages,
	  api = routes.api;

const app = express();
app.locals.appTitle = 'node-blog';

app.set('trust proxy', true);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'your cookie secret'));

var fileStoreOpt = {
	path: '/tmp/blog-session/',
	retries: 0
};

app.use(session({
	secret: process.env.SESSION_SECRET || 'your session secret',
	resave: false,
	saveUninitialized: false,
	store: new FileStore(fileStoreOpt)
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

// article arguments check
const checkArticleArgs = function(req, res, next){
	if(!req.body.article.title || 
			!req.body.article.slug || 
			!req.body.article.text ||
			!req.body.article.tags){
		return res.status(400).json({ message: 'Please fill title, slug and text.'});
	} else {
		return next();
	}
};
// merge arguments so it could be easy to operate with mongodb
const mergeArticleArgs = function(req, res, next){
	if(!req.body.article){
		req.body.article = {
			title: req.body.title,
			slug: req.body.slug,
			text: req.body.text,
			tags: req.body.tags,
			published: req.body.published
		};
	}

	req.body.article.lastModified = new Date();
	return next();
};

// page routes
app.get(['/', '/index'], pages.index.getIndexView);
app.get('/users/login', pages.users.getLoginView);
app.post('/users/login', pages.users.postLogin);
app.get('/users/logout', pages.users.logout);
app.get('/users/admin', authorize, pages.users.getAdminView);
app.get('/articles', authorize, pages.articles.getPostView);
app.post('/articles', authorize, mergeArticleArgs, checkArticleArgs, pages.articles.postArticle);
app.get('/articles/:slug', pages.articles.getArticleBySlug);


// RESTful api
// TODO:should add Authentication
app.put('/api/articles/:id', authorize, api.articles.editArticleById);
app.delete('/api/articles/:id', authorize, api.articles.delArticleById);
app.get('/api/articles', api.articles.getAllArticles);
app.post('/api/articles', authorize, mergeArticleArgs, checkArticleArgs, api.articles.postArticle);

app.use(function(req, res){
	res.sendStatus(404);
});
module.exports = app;
