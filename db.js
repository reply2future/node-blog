const fs = require('fs')
const lowdb = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const lodashId = require('lodash-id')
const path = require('path')

let db

async function init ({ dbDir, dbFilename } = { dbDir: './db', dbFilename: 'data.json' }) {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir)

  db = await lowdb(new FileAsync(path.join(dbDir, dbFilename)))
  db._.mixin(lodashId)
  await db.defaults({
    articles: [],
    users: [{
      email: process.env.ADMIN_USER || 'test@gmail.com',
      password: process.env.ADMIN_PWD || 'e10adc3949ba59abbe56e057f20f883e',
      isAdmin: true
    }]
  }).write()
}

async function getDbInstance () {
  if (db) return db

  await init()
  return db
}

module.exports = {
  getDbInstance,
  init
}
