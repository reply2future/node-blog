const express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	FileStore = require('session-file-store')(session),
	bodyParser = require('body-parser');

const routes = require('./routes/exports'),
	pages = routes.pages,
	api = routes.api;

const app = express();
app.locals.appTitle = 'My Blog';

app.set('trust proxy', true);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
	app.use(logger('dev'));
} else {
	app.use(logger('combined'));
}

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'your cookie secret'));

const fileStoreOpt = {
	path: path.resolve('/tmp/blog-session')
};

app.use(session({
	secret: process.env.SESSION_SECRET || 'your session secret',
	resave: false,
	saveUninitialized: false,
	store: new FileStore(fileStoreOpt)
}));


// load data
app.use(function(req, res, next){
	req.db = app.get('db');
	return next();
});

// authentication
app.use(function(req, res, next){
	if(req.session && req.session.isAdmin)
		res.locals.isAdmin = true;
	next();
});

const authorize = function(req, res, next){
	if(req.session && req.session.isAdmin)
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
app.put('/api/articles/:id', authorize, mergeArticleArgs, api.articles.editArticleById);
app.delete('/api/articles/:id', authorize, api.articles.delArticleById);
app.get('/api/articles', api.articles.getAllArticles);
app.post('/api/articles', authorize, mergeArticleArgs, checkArticleArgs, api.articles.postArticle);

// error handler
app.use((err, req, res, next) => {
	if (err) {
		res.status(500).send({ message: err.message });
		return;
	}

	next();
});

app.use(function(req, res){
	res.sendStatus(404);
});
module.exports = app;
