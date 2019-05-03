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
async function run() {
  let data = []
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i + 1,
      user: `user${i + 1}`,
      pass: `pass${i + 1}`,
      displayName: `User${i + 1} Krub`,
    })
  }
  let ids = await db('teacher').insert(data)
  console.log('ids=', ids)
}
run()