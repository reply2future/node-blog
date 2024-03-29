const express = require('express')
const os = require('os')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')

const routes = require('./routes/exports')
const pages = routes.pages
const api = routes.api

const app = express()
app.locals.appTitle = 'My Blog'
app.locals.ga = process.env.GOOGLE_ANALYTICS === 'true'
app.locals.gid = process.env.GOOGLE_ANALYTICS_ID
app.locals.dsq = process.env.DISQUS === 'true'
app.locals.dsqn = process.env.DISQUS_NAME

app.set('trust proxy', true)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
} else {
  app.use(logger('combined'))
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET || 'your cookie secret'))

const fileStoreOpt = {
  path: path.join(os.tmpdir(), '/tmp/blog-session')
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'your session secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore(fileStoreOpt)
}))

// load data
app.use(async function (req, res, next) {
  const db = app.get('db')
  // update the database state
  await db.read()
  req.db = db
  return next()
})

// authentication
app.use(function (req, res, next) {
  if (req.session && req.session.isAdmin) { res.locals.isAdmin = true }
  next()
})

const authorize = function (req, res, next) {
  if (req.session && req.session.isAdmin) { return next() } else { return res.sendStatus(401) }
}

// article arguments check
const checkArticleArgs = function (req, res, next) {
  if (['title', 'slug', 'text', 'tags'].some(key => !req.body.article[key])) return res.status(400).json({ message: 'Please fill title, slug and text.' })

  return next()
}
// merge arguments so it could be easy to operate with mongodb
const mergeArticleArgs = function (req, res, next) {
  if (!req.body.article) {
    req.body.article = {
      title: req.body.title,
      slug: req.body.slug,
      text: req.body.text,
      tags: req.body.tags,
      published: req.body.published
    }
  }

  req.body.article.lastModified = new Date()
  return next()
}

// page routes
app.get(['/', '/index'], pages.index.getIndexView)
app.get('/users/login', pages.users.getLoginView)
app.post('/users/login', pages.users.postLogin)
app.get('/users/logout', pages.users.logout)
app.get('/users/admin', authorize, pages.users.getAdminView)
app.get('/articles', authorize, pages.articles.getPostView)
app.post('/articles', authorize, mergeArticleArgs, checkArticleArgs, pages.articles.postArticle)
app.get('/articles/:slug', pages.articles.getArticleBySlug)

// RESTful api
app.put('/api/articles/:id', authorize, mergeArticleArgs, api.articles.editArticleById)
app.delete('/api/articles/:id', authorize, api.articles.delArticleById)
app.get('/api/articles', api.articles.getAllArticles)
app.post('/api/articles', authorize, mergeArticleArgs, checkArticleArgs, api.articles.postArticle)

app.post('/api/search', api.search.search)
app.get('/api/rss', api.rss.feed)

// error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send({ message: err.message })
    return
  }

  next()
})

app.use(function (req, res) {
  res.sendStatus(404)
})
module.exports = app
