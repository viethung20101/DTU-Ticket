import { Router } from 'express'
import { createReviewsController, getReviewsController } from '~/controllers/reviews.controllers'
import { createReviewsValidator } from '~/middlewares/reviews.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const reviewsRouter = Router()

reviewsRouter.post('/', createReviewsValidator, wrapRequestHandler(createReviewsController))

reviewsRouter.get('/list', wrapRequestHandler(getReviewsController))

export default reviewsRouter
