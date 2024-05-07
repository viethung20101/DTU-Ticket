import { Request, Response, NextFunction, application } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { resolve } from 'path'
import { CreateReviewReqBody } from '~/models/Requests/review.request'
import reviewsService from '~/services/reviews.services'

export const createReviewsController = async (
  req: Request<ParamsDictionary, any, CreateReviewReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await reviewsService.createReviews(req.body)
  return res.json({
    message: 'Create review success',
    result: result
  })
}
