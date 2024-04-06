import express from 'express'
import usersRouter from '~/routes/users.routes'
import db from './services/database.services'
const app = express()
const port = 3000
app.use(express.json())

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.')
  })
  .catch((err: Error) => {
    console.log('Failed to sync db: ' + err.message)
  })

app.get('/', (req, res) => {
  res.send('ok')
})
app.use('/api/v1/users', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
