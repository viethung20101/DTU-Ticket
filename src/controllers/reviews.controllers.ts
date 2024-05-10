import { Request, Response, NextFunction, application } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
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
    message: 'Create review success',
    result: result
  })
}
