const express = require('express'),
	  mongoskin = require('mongoskin'),
	  http = require('http'),
	  path = require('path'),
	  logger = require('morgan'),
	  cookieParser = require('cookie-parser'),
	  bodyParser = require('body-parser');

const index = require('./routes/page/index'),
	  article = require('./routes/page/article'),
	  user = require('./routes/page/user'),
	  articleApi = require('./routes/api/article');

const app = express();
app.locals.appTitle = 'node-blog';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// through docker --link the mongodb container
// access mongodb using docker container alias
const dbUrl = process.env.MONGOHQ_URL || 'mongodb://mongodb:27017/blog',
	  db = mongoskin.db(dbUrl, {safe: true}),
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

// page routes
app.use('/', index);
app.use('/user', user);
app.use('/article', article);

// RESTful api
app.use('/api/articles', articleApi);

app.use(function(req, res){
	res.sendStatus(404);
});
module.exports = app;


