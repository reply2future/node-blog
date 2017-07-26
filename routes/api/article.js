var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	req.collections.articles.find({}).toArray(function(error, articles){
		if(error)
			return next(error);
		res.send({articles:articles});
	});
});
/*
 * Post articles
 */
router.post('/', function(req, res, next){
	if(!req.body.article)
		return next(new Error('No article payload.'));
	let article = req.body.article;
	article.published = false;
	req.collections.articles.insert(article, function(error, articleResponse){
		if(error)
			return next(error);
		res.send(articleResponse);
	});
});

/*
 * Edit articles
 */
router.put('/:id', function(req, res, next){
	if(!req.params.id)
		return next(new Error('No article ID.'));

	req.collections.articles.updateById(req.params.id, {$set: req.body.article}, function(error, count){
		if(error)
			return next(error);

		res.send({affectedCount: count});
	});
});


router.delete('/:id', function(req, res, next){
	if(!req.params.id)
		return next(new Error('No article ID.'));

	req.collections.articles.removeById(req.params.id, function(error, count){
		if(error)
			return next(error);
		res.send({affectedCount: count});
	});
});

module.exports = router;
