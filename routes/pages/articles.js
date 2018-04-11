
/*
 * get the post view 
 * 
 * {
 *   method: 'GET',
 *   url: '/articles'
 *   option: 'id='
 * }
 */
exports.getPostView = function(req, res, next){

	try {
		if(!req.query.id){
			res.render('post');
		}else{
			// fill view with article
			let article = req.db.get('articles').getById(req.query.id).value();

			if(!article)
				return res.sendStatus(404);
			res.render('post', article);
		} 
	} catch (error) {
		next(error);
	}
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

	try {
		req.db.get('articles').insert({
			title: req.body.title,
			slug: req.body.slug,
			tags: req.body.tags,
			text: req.body.text,
			published: false,
			lastModified: new Date()
		}).write();
		res.status(201).json({ message: 'Article was added. Publish it on Admin page.'});
	} catch(error) {
		next(error);
	}
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

	try {
		let article = req.db.get('articles').find({slug: req.params.slug}).value();
		if(!article || !article.published)
			return res.sendStatus(404);
		res.render('article', article);
	} catch(error) {
		next(error);
	}
};
