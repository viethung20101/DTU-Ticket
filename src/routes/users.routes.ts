import { Router } from 'express'
import { registorValidator } from '../middlewares/users.middlewares'
import { registerController } from '~/controllers/users.controllers'
const usersRouter = Router()

usersRouter.post('/register', registorValidator, registerController)

export default usersRouter
