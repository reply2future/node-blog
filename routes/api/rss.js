const { getXmlFeed } = require('../../rss')

/*
 * get rss feed
 * {
 *   method: 'GET',
 *   url: '/api/rss'
 * }
 */
exports.feed = async (req, res, next) => {
  try {
    res.set('Content-Type', 'application/rss+xml')
    res.send(getXmlFeed())
  } catch (error) {
    next(error)
  }
}
