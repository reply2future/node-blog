const RSS = require('rss')
const siteUrl = process.env.RSS_SITE_URL || `http://localhost:${process.env.PORT || 3000}`
const feedUrl = new URL('/api/rss', siteUrl)

const feed = new RSS({
  title: process.env.RSS_TITLE,
  description: process.env.RSS_DESCRIPTION,
  feed_url: feedUrl.href,
  site_url: process.SITE_URL,
  webMaster: process.env.RSS_WEB_MASTER,
  copyright: process.env.RSS_COPYRIGHT,
  language: process.env.RSS_LANGUAGE,
  ttl: '60'
})

function addFeed ({ title, slug, date, description }) {
  const url = new URL(`/articles/${slug}`, siteUrl)
  feed.item({
    title,
    description,
    url: url.href,
    date
  })
}

function getXmlFeed () {
  return feed.xml()
}

module.exports = {
  addFeed,
  getXmlFeed
}
