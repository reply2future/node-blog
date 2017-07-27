/*
 * show index view 
 * {
 *   method: 'GET',
 *   url: ['/', '/index']
 * }
 */
exports.getIndexView = function(req, res, next){
	req.collections.articles.find({published: true}, {sort:{_id:-1}}).toArray(function(error, articles){
		if(error)
			return next(error);

		res.render('index', {articles: articles});
	});
};
