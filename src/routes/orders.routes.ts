import { Router } from 'express'
import { createOrdersController } from '~/controllers/orders.controllers'
import { createOrderValidator } from '~/middlewares/orders.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ordersRouter = Router()

ordersRouter.post('/create', createOrderValidator, wrapRequestHandler(createOrdersController))

export default ordersRouter
