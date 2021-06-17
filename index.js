const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')
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
  },
})

const app = express()

app.use(express.static('./public'))
app.use(cors())
app.use(fileUpload())

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})

app.use('/api', express.json())

app.post('/api/login', async (req, res) => {
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
      students: rows,
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
      ok: 1,
      student: row,
    })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.post('/api/student', async (req, res) => {
  // TODO:
  try {
    if (!req.body.code || !req.body.name || !req.body.tid) {
      throw new Error('code, name, tid is required')
    }

    let row = await db('student').where({code: req.body.code}).then(rows => rows[0])

    if (!row) {
      let ids = await db('student').insert({
        code: req.body.code,
        name: req.body.name,
        tid: req.body.tid,
        birth: req.body.birth,
      })
      return res.send({ ok: 1, id: ids[0] })
    }

    await db('student')
      .where({code: req.body.code})
      .update({
        name: req.body.name,
        tid: req.body.tid,
        birth: req.body.birth,
      })

    res.send({ ok: 1, id: row.id })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.get('/api/photo/:id', async (req, res) => {
  res.sendFile(path.resolve(`./public/photo/${req.params.id}.jpg`))
})

app.post('/api/photo', async (req, res) => {
  try {
    if (!req.files.photo) {
      return res.send({ ok: 0, error: 'No files were uploaded.' })
    }

    let photoId = await db('photo').insert({ refType: req.body.refType, refId: req.body.refId }).then(ids => ids[0])
    let fname = `${photoId}.jpg`
    let photoUrl = `/photo/${fname}`

    await req.files.photo.mv(`./public/photo/${fname}`)

    await db('photo')
      .where({ id: photoId })
      .update({file: `/photo/${fname}`})

    if (req.body.refId) {
      await db('student')
        .where({id: req.body.refId})
        .update({
          photo: photoUrl,
        })
    }

    res.send({ ok: 1, id: photoId, url: photoUrl })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})

app.listen(7001, () => {
  console.log('ready')
})
