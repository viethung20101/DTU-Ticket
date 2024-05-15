import { Request, Response, NextFunction, application } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { REVIEWS_MESSAGES } from '~/constants/messages'
import { CreateReviewReqBody } from '~/models/Requests/review.request'
import { TokenPayload } from '~/models/Requests/user.requests'
import reviewsService from '~/services/reviews.services'

export const createReviewsController = async (
  req: Request<ParamsDictionary, any, CreateReviewReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await reviewsService.createReviews({ payload: req.body, user_id: user_id })
  return res.json({
    message: REVIEWS_MESSAGES.CREATE_REVIEW_SUCCESS,
    result: result
  })
}

export const getAllReviewsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await reviewsService.getAllReviews()
  return res.json({
    message: REVIEWS_MESSAGES.GET_ALL_REVIEWS_SUCCESS,
    result
  })
}

export const getReviewsController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await reviewsService.getReviews(user_id)
  return res.json({
    message: REVIEWS_MESSAGES.GET_ALL_REVIEWS_SUCCESS,
    result
  })
}
