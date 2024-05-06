import { Router } from 'express'
import { serveImageController, serveTicketImageController } from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)

staticRouter.get('/image/tickets/:name', serveTicketImageController)

export default staticRouter
