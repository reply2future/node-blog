const app = require('../app')
const http = require('http')
const nodemailer = require('nodemailer')
const port = parseInt(process.env.PORT || 3000)
const db = require('../db')

app.set('port', port)
const server = http.createServer(app)

// done is use to test
const boot = (done) => {
  initDb().then(() => {
    server.listen(port, () => {
      if (typeof done === 'function') done()
      console.log('Node blog is listenning')
    })
  }).catch(done)
}

const shutdown = () => {
  server.close()
}

// database init
async function initDb () {
  const dbDir = './db'
  const dbFilename = process.env.DB_FILE_NAME || 'data.json'

  try {
    await db.init({ dbDir, dbFilename })
    app.set('db', await db.getDbInstance())
  } catch (err) {
    console.error(`Init database error:${err.message}`)
    process.exit(-1)
  }
}

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
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
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

// normal start up
if (require.main === module) {
  boot()
}

exports.boot = boot
exports.shutdown = shutdown
exports.port = port
