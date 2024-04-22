import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'

const cartRouter = Router()

cartRouter.post('/add')

export default cartRouter
