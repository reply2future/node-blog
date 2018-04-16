/*
 * get all articles
 * {
 *   method: 'GET',
 *   url: '/api/articles',
 *   querystring: {
 *		offset:number,
 *		limit: number,
 *		order: 'desc'|'asc', // default order by time
 *	}
 * }
 */
exports.getAllArticles = function(req, res, next){
	let _offset = req.query.offset || 0;
	let _limit = req.query.limit || 10;
	let _order = req.query.order || 'desc';

	try {
		let _articles = req.db.get('articles')
			.filter({published: true})
			.orderBy(['lastModified'], [_order]).slice(_offset, _limit)
			.value();
		res.status(200).json({message:_articles});
	} catch (error) {
		next(error);
	}
};
/*
 * post article
 * {
 *   method:'POST',
 *   url: '/api/articles'
 * }
 */
exports.postArticle = function(req, res, next){
	req.body.article.published = false;
	try {
		req.db.get('articles').push(req.body.article).write();
		res.status(201).json({ message: 'Article was added. Publish it on Admin page.'});
	} catch (error) {
		next(error);
	}
};

/*
 * Edit article by id
 * {
 *   method: 'PUT',
 *   url: '/api/articles/:id'
 * }
 */
exports.editArticleById = function(req, res, next){
	if(!req.params.id)
		return res.status(400).json({message:'No article ID.'});

	try {
		req.db.get('articles').updateById(req.params.id, req.body.article).write();
		res.status(200).json({message: 'Article was edited.'});
	} catch(error) {
		next(error);
	}
};

/*
 * delete article by id
 * {
 *   method: 'DELETE',
 *   url: '/api/articles/:id'
 * }
 */
exports.delArticleById = function(req, res, next){
	if(!req.params.id)
		return res.status(400).json({message:'No article ID.'});

	try {
		req.db.get('articles').removeById(req.params.id).write();
		res.status(200).json({message: 'Article was deleted'});
	} catch(error) {
		next(error);
	}
};
