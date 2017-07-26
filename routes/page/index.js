var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	req.collections.articles.find({published: true}, {sort:{_id:-1}}).toArray(function(error, articles){
		if(error)
			return next(error);

		res.render('index', {articles: articles});
	});
});

module.exports = router;
