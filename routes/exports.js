module.exports = {
  pages: {
    articles: require('./pages/articles'),
    users: require('./pages/users'),
    index: require('./pages/index')
  },
  api: {
    articles: require('./api/articles'),
    search: require('./api/search')
  }
}
