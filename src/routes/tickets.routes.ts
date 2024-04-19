import { Router } from 'express'
import { getTicketDetailsController, getTicketsController } from '~/controllers/tickets.controllers'

const ticketsRouter = Router()

ticketsRouter.get('/data', getTicketsController)

ticketsRouter.get('/details', getTicketDetailsController)

export default ticketsRouter
