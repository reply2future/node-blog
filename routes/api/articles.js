const { addFeed } = require('../../rss')
/*
 * get all articles
 * {
 *   method: 'GET',
 *   url: '/api/articles',
 *   querystring: {
 *    offset:number,
 *    limit: number,
 *    order: 'desc'|'asc', // default order by time
 * }
 * }
 */
exports.getAllArticles = (req, res, next) => {
  const _offset = req.query.offset || 0
  const _limit = req.query.limit || 10
  const _order = req.query.order || 'desc'

  try {
    const _articles = req.db.get('articles')
      .filter({ published: true })
      .orderBy(['lastModified'], [_order]).slice(_offset, _limit)
      .value()
    res.status(200).json({ message: _articles })
  } catch (error) {
    next(error)
  }
}
/*
 * post article
 * {
 *   method:'POST',
 *   url: '/api/articles'
 * }
 */
exports.postArticle = async (req, res, next) => {
  try {
    req.body.article.published = req.body.article.published || false
    await req.db.get('articles').push(req.body.article).write()
    res.status(201).json({ message: 'Article was added. Publish it on Admin page.' })
  } catch (error) {
    next(error)
  }
}

/*
 * Edit article by id
 * {
 *   method: 'PUT',
 *   url: '/api/articles/:id'
 * }
 */
exports.editArticleById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'No article ID.' })
    }
    await req.db.get('articles').updateById(req.params.id, req.body.article).write()

    // TODO: move it to db operation, because it should be triggered when the article is modified or inserted.
    if (req.body.article.published) {
      const article = await req.db.get('articles').getById(req.params.id).value()
      addFeed({
        title: article.title,
        description: article.title,
        slug: article.slug,
        date: article.lastModified
      })
    }

    res.status(200).json({ message: 'Article was edited.' })
  } catch (error) {
    next(error)
  }
}

/*
 * delete article by id
 * {
 *   method: 'DELETE',
 *   url: '/api/articles/:id'
 * }
 */
exports.delArticleById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'No article ID.' })
    }
    await req.db.get('articles').removeById(req.params.id).write()
    res.status(200).json({ message: 'Article was deleted' })
  } catch (error) {
    next(error)
  }
}
