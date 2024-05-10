import { Router } from 'express'
import { getGroupTicketsController } from '~/controllers/groupTickets.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const groupTicketsRouter = Router()

groupTicketsRouter.get('/data', wrapRequestHandler(getGroupTicketsController))

export default groupTicketsRouter
