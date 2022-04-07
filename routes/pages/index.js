/*
 * show index view
 * {
 *   method: 'GET',
 *   url: ['/', '/index']
 * }
 */
exports.getIndexView = (req, res, next) => {
  const _offset = +req.query.offset || 0
  const _limit = +req.query.limit || 10
  const _order = req.query.order || 'desc'

  try {
    const _totalArticles = req.db.get('articles').filter({ published: true }).size().value()
    const _currentPageNum = _offset / _limit + 1
    const _totalPageNum = Math.ceil(_totalArticles / _limit)
    const _articles = req.db.get('articles')
      .filter({ published: true })
      .orderBy(['lastModified'], [_order]).slice(_offset, _limit + _offset)
      .value()
    res.render('index', { articles: _articles, currentPageNum: _currentPageNum, totalPageNum: _totalPageNum })
  } catch (error) {
    next(error)
  }
}
