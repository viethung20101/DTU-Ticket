import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import { createGroupTicketsController, getGroupTicketsController } from '~/controllers/groupTickets.controllers'

const adminRouter = Router()

adminRouter.get('/group-tickets/data', wrapRequestHandler(getGroupTicketsController))

adminRouter.post('/group-tickets/create', wrapRequestHandler(createGroupTicketsController))

export default adminRouter
