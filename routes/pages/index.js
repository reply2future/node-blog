/*
 * show index view
 * {
 *   method: 'GET',
 *   url: ['/', '/index']
 * }
 */
exports.getIndexView = (req, res, next) => {
  const _offset = req.query.offset || 0
  const _limit = req.query.limit || 10
  const _order = req.query.order || 'desc'

  try {
    const _articles = req.db.get('articles')
      .filter({ published: true })
      .orderBy(['lastModified'], [_order]).slice(_offset, _limit)
      .value()
    res.render('index', { articles: _articles })
  } catch (error) {
    next(error)
  }
}
