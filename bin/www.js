const app = require('../app')
const http = require('http')
const nodemailer = require('nodemailer')
const fs = require('fs')
const lowdb = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const lodashId = require('lodash-id')
const path = require('path')
const port = process.env.PORT || 3000

app.set('port', port)
const server = http.createServer(app)

// done is use to test
const boot = (done) => {
  server.listen(port, () => {
    console.log('Node blog is listenning')
    if (typeof done === 'function') {
      done()
    }
  })
}

const shutdown = () => {
  server.close()
}

// database init
const dbDir = './db'

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

lowdb(new FileAsync(path.join(dbDir, 'data.json')))
  .then(db => {
    db._.mixin(lodashId)
    app.set('db', db)
    return db.defaults({
      articles: [],
      users: [{
        email: process.env.ADMIN_USER || 'test@gmail.com',
        password: process.env.ADMIN_PWD || 'e10adc3949ba59abbe56e057f20f883e',
        isAdmin: true
      }]
    }).write()
  })
  .then(() => {
    if (require.main === module) {
      boot()
    }
  })
  .catch(err => {
    console.error(`Server error:${err.message}`)
    process.exit(-1)
  })

if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', (err) => {
    // send email to admin
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // true for 456, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'uncaughtException',
      text: `There is an uncaughtException in the node-blog${err}`
    }

    transporter.sendMail(mailOptions, (sErr, info) => {
      if (sErr) {
        console.error(sErr)
      } else {
        console.log(`Send mail successfully.${info}`)
      }
    })
    process.exit(-2)
  })
}

exports.boot = boot
exports.shutdown = shutdown
exports.port = port
