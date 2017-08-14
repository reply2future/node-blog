
/*
 * get the post view 
 * 
 * {
 *   method: 'GET',
 *   url: '/articles'
 * }
 */
exports.getPostView = function(req, res, next){
	if(!req.body.title)
		res.render('post');
};

/*
 * Deprecated: Please use /api/articles instead.
 *
 * post article
 *
 * {
 *   method: 'POST',
 *   url: '/articles'
 * }
 */

exports.postArticle = function(req, res, next){
	// return res.status(403).json({ message: ' Deprecated: Please use /api/articles instead.'});

	if(!req.body.title || !req.body.slug || !req.body.text){
		return res.status(400).json({ message: 'Please fill title, slug and text.'});
	}

	req.collections.articles.insert({
		title: req.body.title,
		slug: req.body.slug,
		tags: req.body.tags,
		text: req.body.text,
		published: false,
		lastModified: new Date()
	}, function(error, articleResponse){
		if(error)
			return next(error);

		res.status(201).json({ message: 'Article was added. Publish it on Admin page.'});
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
		return res.status(400).json({message: 'No article slug.'});

	req.collections.articles.findOne({slug: req.params.slug}, function(error, article){
		if(error)
			return next(error);

		if(!article || !article.published)
			return res.sendStatus(404);
		res.render('article', article);
	});
};
