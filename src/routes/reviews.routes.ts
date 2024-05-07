import { Router } from 'express'
import { createReviewsController } from '~/controllers/reviews.controllers'
import { createReviewsValidator } from '~/middlewares/reviews.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const reviewsRouter = Router()

reviewsRouter.post('/', createReviewsValidator, wrapRequestHandler(createReviewsController))

export default reviewsRouter
