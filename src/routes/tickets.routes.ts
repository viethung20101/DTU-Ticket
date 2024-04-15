import { Router } from 'express'
import { getTicketsController } from '~/controllers/tickets.controllers'

const ticketsRouter = Router()

ticketsRouter.get('/get-ticket', getTicketsController)

export default ticketsRouter
