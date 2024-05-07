import { v4 as uuidv4 } from 'uuid'
import { CreateReviewReqBody } from '~/models/Requests/review.request'
import Review from '~/models/schemas/review.models'

class ReviewsService {
  async createReviews(payload: CreateReviewReqBody) {
    try {
      const result = await Review.create({
        _id: uuidv4(),
        payload,
        date: new Date()
      })
      return result
    } catch (error) {
      console.log(error)
      throw new Error('Error: ' + error)
    }
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
