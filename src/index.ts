import express from 'express'
import usersRouter from '~/routes/users.routes'
import ticketsRouter from '~/routes/tickets.routes'
import adminRouter from '~/routes/admin.routes'
import db from './services/database.services'
import { defaultErrorHandler } from '~/middlewares/errors.middlewares'
import { config } from 'dotenv'
import { accessTokenValidator, verifiedUserValidator } from './middlewares/users.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import staticRouter from './routes/static.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import { startServerJobs, startDailyResetJob } from './utils/job'
import ordersRouter from './routes/orders.routes'
import paymentsRouter from './routes/payments.routes'

config()

db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.')
  })
  .catch((err: Error) => {
    console.log('Failed to sync db: ' + err.message)
  })

const app = express()

const httpServer = createServer(app)

initFolder()
startServerJobs()
startDailyResetJob()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('ok')
})

app.use('/api/v1/admin', accessTokenValidator, verifiedUserValidator, adminRouter)

app.use('/api/v1/users', usersRouter)

app.use('/api/v1/tickets', ticketsRouter)

app.use('/api/v1/medias', mediasRouter)

app.use('/api/v1/static', staticRouter)

app.use('/api/v1/orders', accessTokenValidator, verifiedUserValidator, ordersRouter)

app.use('/api/v1/payments', paymentsRouter)

app.use(defaultErrorHandler)

const sio = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

// const pythonSocket = io('http://localhost:6969')

// pythonSocket.on('message', (data) => {
//   console.log(data.memory)
//   sio.to(data.senderId).emit('message', { message: data.message })
// })

sio.on('connection', (socket) => {
  // console.log(`User ${socket.id} connected`)
  // socket.on('message', (data) => {
  //   console.log('Da nhan')
  //   console.log(data)
  //   pythonSocket.emit('message', { message: data.message, senderId: socket.id })
  // })
  // socket.on('disconnect', () => {
  //   console.log(`User ${socket.id} disconnected`)
  // })
})

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})
