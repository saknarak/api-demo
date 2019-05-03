const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('knex')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '10.0.1.181',
    port: process.env.MYSQL_PORT || 33011,
    user: process.env.MYSQL_USER || 'training',
    password: process.env.MYSQL_PASS || 'training123',
    database: process.env.MYSQL_DB || 'training',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  }
})
const app = express()


app.use(express.static('./public'))
app.use(cors())

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})

app.use('/api', bodyParser.json())

app.post('/api/login', bodyParser.json(), async (req, res) => {
  try {
    let row = await db('teacher')
      .where({ user: req.body.user, pass: req.body.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user/pass incorrect')
    }
    res.send({ ok: 1, user: row })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.get('/api/student', async (req, res) => {
  try {
    let rows = await db('student')
      .where({ tid: req.query.tid || 0 })
      .orderBy('code', 'asc')
    res.send({
      ok: 1,
      rows,
    })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.get('/api/student/:id', async (req, res) => {
  try {
    let row = await db('student')
      .where({ id: req.params.id || 0})
      .then(rows => rows[0])
    if (!row) {
      throw new Error('student not found')
    }
    res.send({
      status: 1,
      student: row,
    })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})


app.post('/api/student', async (req, res) => {

})

app.listen(7001, () => {
  console.log('ready')
})
