import express from 'express'
import usersRouter from '~/routes/users.routes'
import ticketsRouter from '~/routes/tickets.routes'
import adminRouter from '~/routes/admin.routes'
import db from './services/database.services'
import { defaultErrorHandler } from '~/middlewares/errors.middlewares'
import { config } from 'dotenv'
import { accessTokenValidator } from './middlewares/users.middlewares'
import { roleAdminValidator } from './middlewares/admin.middlewares'

config()

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.')
  })
  .catch((err: Error) => {
    console.log('Failed to sync db: ' + err.message)
  })

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('ok')
})

app.use('/api/v1/admin', accessTokenValidator, roleAdminValidator, adminRouter)

app.use('/api/v1/users', usersRouter)

app.use('/api/v1/tickets', ticketsRouter)

app.use(defaultErrorHandler)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})
