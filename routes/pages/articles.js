
/*
 * get the post view 
 * 
 * {
 *   method: 'GET',
 *   url: '/articles/post'
 * }
 */
exports.getPostView = function(req, res, next){
	if(!req.body.title)
		res.render('post');
};

/*
 * post article
 *
 * {
 *   method: 'POST',
 *   url: '/articles/post'
 * }
 */

exports.postArticle = function(req, res, next){
	if(!req.body.title || !req.body.slug || !req.body.text){
		return res.render('post', { error: 'Please fill title, slug and text.'});
	}

	let article = {
		title: req.body.title,
		slug: req.body.slug,
		text: req.body.text,
		// TODO:attribute get
		published: false
	};

	req.collections.articles.insert(article, function(error, articleResponse){
		if(error)
			return next(error);

		res.render('post', { error: 'Article was added. Publish it on Admin page.'});
	});
};

/*
 * get admin view
 *
 * {
 *   method: 'GET',
 *   url: '/articles/admin'
 * }
 */
exports.getAdminView = function(req, res, next){
	req.collections.articles.find({}, {sort:{_id: -1}}).toArray(function(error, articles){
		if(error)
			return next(error);

		res.render('admin', { articles: articles });
	});
};

/*
 * show the article of slug
 *
 * {
 *   method: 'GET',
 *   url: '/articles/:slug'
 * }
 */
exports.getArticleBySlug = function(req, res, next){
	if(!req.params.slug)
		return next(new Error('No article slug.'));

	req.collections.articles.findOne({slug: req.params.slug}, function(error, article){
		if(error)
			return next(error);

		if(!article || !article.published)
			return res.sendStatus(404);
		res.render('article', article);
	});
};
