import { Router } from 'express'
import { getTicketsController } from '~/controllers/tickets.controllers'

const ticketsRouter = Router()

ticketsRouter.get('/data', getTicketsController)

export default ticketsRouter
