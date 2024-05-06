import { Router } from 'express'
import { getTicketDetailsController, getTicketsController } from '~/controllers/tickets.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const ticketsRouter = Router()

ticketsRouter.get('/data', wrapRequestHandler(getTicketsController))

ticketsRouter.get('/details', wrapRequestHandler(getTicketDetailsController))

export default ticketsRouter
