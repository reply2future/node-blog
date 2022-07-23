(function setUnitTestEnv () {
  process.env.DB_FILE_NAME = 'unit_test.json'
  // delete all data
  const fs = require('fs')
  const path = require('path')
  const unitTestDbPath = path.join('./db', process.env.DB_FILE_NAME)
  if (!fs.existsSync(unitTestDbPath)) return
  fs.unlinkSync(unitTestDbPath)
})()

const app = require('../bin/www')
const superagent = require('superagent')
const expect = require('expect.js')
const db = require('../db')

describe('api module', () => {
  const testUser = {
    email: 'test@gmail.com',
    password: '123456',
    isAdmin: true
  }
  const postData = {
    article: {
      id: '18b28be4f366d000689806a',
      title: 'test-article-title',
      slug: 'test-article-slug',
      published: true, // for unit test
      tags: [
        'test',
        'article'
      ],
      text: {
        ops: [
          {
            insert: 'test'
          },
          {
            attributes: {
              link: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp/'
            },
            insert: '文档'
          },
          {
            insert: ',由于需求略作改动后，发现会因为无法找到node_modules的各项依赖而报错。\n\n'
          },
          {
            insert: '供参考。\n'
          }
        ]
      }
    }
  }
  const authorizedUser = superagent.agent()
  let articles

  before((done) => {
    app.boot(() => {
      authorizedUser
        .post('http://localhost:' + app.port + '/users/login')
        .send(testUser)
        .redirects(1)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })
  })

  describe('authorize and authenticate', function () {
    it('should forbid to access the page', function (done) {
      superagent
        .get('http://localhost:' + app.port + '/users/admin')
        .end(function (err, res) {
          expect(err).not.be.equal(null)
          expect(res.status).to.equal(401)
          done()
        })
    })

    it('should login successfully by email and password', function (done) {
      superagent.agent()
        .post('http://localhost:' + app.port + '/users/login')
        .send(testUser)
        .redirects(1)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })

    it('should access the admin page', function (done) {
      authorizedUser
        .get('http://localhost:' + app.port + '/users/admin')
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })

    it('should post successfully', function (done) {
      authorizedUser
        .post('http://localhost:' + app.port + '/api/articles')
        .send(JSON.stringify(postData))
        .set('Content-Type', 'application/json')
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(201)

          superagent
            .get('http://localhost:' + app.port + '/api/articles')
            .end(function (err, res) {
              expect(err).to.be.equal(null)
              expect(res.status).to.equal(200)
              articles = res.body.message
              expect(articles.length).to.equal(1)
              expect(articles[0].lastModified).to.be.a('string')
              done()
            })
        })
    })

    it('should modify successfully', function (done) {
      postData.article.title = 'Modified'
      authorizedUser
        .put('http://localhost:' + app.port + '/api/articles/' + postData.article.id)
        .send(postData)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })

    it('should get all articles successfully', function (done) {
      superagent
        .get('http://localhost:' + app.port + '/api/articles')
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          articles = res.body.message
          expect(articles.length).to.equal(1)
          console.log(`fetch ${articles ? articles.length : 0} size of articles`)
          done()
        })
    })

    it('should listen successfully', function (done) {
      superagent
        .get('http://localhost:' + app.port)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })

    it('should contain posts', function (done) {
      superagent
        .get('http://localhost:' + app.port)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          articles.forEach(function (item, index, list) {
            if (item.published) {
              expect(res.text).to.contain(item.title)
            } else {
              expect(res.text).not.to.contain(item.title)
            }
          })

          done()
        })
    })

    it('should delete successfully', function (done) {
      authorizedUser
        .delete('http://localhost:' + app.port + '/api/articles/' + postData.article.id)
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          done()
        })
    })
  })

  describe('search module', function () {
    before(function (done) {
      db.getDbInstance().then(function (dbInstance) {
        return dbInstance.get('articles').push(...[
          { title: 'eat some food', text: 'can do test', slug: 'test1' },
          { title: 'eat test food', text: 'can do', slug: 'test2' },
          { title: 'eat test food', text: 'can do test', slug: 'test3' },
          { title: 'eat some food', text: 'can do', slug: 'test4' }
        ]).write()
      }).then(() => done()).catch(done)
    })
    // it would clear data when restart unit test, so no need to do anything here
    // after(function (done) {
    // })
    it('should not match anything', function (done) {
      superagent
        .post('http://localhost:' + app.port + '/api/search')
        .send({ keyword: 'not match' })
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          const matches = res.body.message
          expect(matches.length).to.equal(0)
          done()
        })
    })
    it('should search successfully', function (done) {
      superagent
        .post('http://localhost:' + app.port + '/api/search')
        .send({ keyword: 'test' })
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(200)
          const matches = res.body.message
          expect(matches.length).to.equal(3)
          matches.forEach(m => {
            expect(m.link).to.contain('/articles/test')
          })
          done()
        })
    })
  })

  describe('rss feed module', function () {
    it('should get feed xml successfully', function (done) {
      const mockPostData = JSON.parse(JSON.stringify(postData))
      mockPostData.title = 'test rss feed'
      mockPostData.id = Date.now().toString()
      authorizedUser
        .post('http://localhost:' + app.port + '/api/articles')
        .send(JSON.stringify(mockPostData))
        .set('Content-Type', 'application/json')
        .end(function (err, res) {
          expect(err).to.be.equal(null)
          expect(res.status).to.equal(201)

          authorizedUser
            .put('http://localhost:' + app.port + '/api/articles/' + mockPostData.article.id)
            .send(JSON.stringify(mockPostData))
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
              expect(err).to.be.equal(null)
              expect(res.status).to.equal(200)
              superagent
                .get('http://localhost:' + app.port + '/api/rss')
                .end(function (err, res) {
                  expect(err).to.be.equal(null)
                  expect(res.status).to.equal(200)
                  expect(res.body.toString()).to.contain(mockPostData.article.title)
                  done()
                })
            })
        })
    })
  })

  after(function () {
    app.shutdown()
  })
})
