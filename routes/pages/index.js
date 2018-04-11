/*
 * show index view 
 * {
 *   method: 'GET',
 *   url: ['/', '/index']
 * }
 */
exports.getIndexView = function(req, res, next){
	let _offset = req.query.offset || 0;
	let _limit = req.query.limit || 10;
	let _order = req.query.order || 'desc';

	try {
		let _articles = req.db.get('articles')
			.filter({published: true})
			.orderBy(['lastModified'], [_order]).slice(_offset, _limit)
			.value();
		res.render('index', {articles: _articles});
	} catch (error) {
		next(error);
	}
};
