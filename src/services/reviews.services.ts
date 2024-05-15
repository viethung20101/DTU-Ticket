import { v4 as uuidv4 } from 'uuid'
import { ReviewsStatus } from '~/constants/enums'
import { CreateReviewReqBody } from '~/models/Requests/review.request'
import OrderDetails from '~/models/schemas/orderDetails.models'
import Review from '~/models/schemas/review.models'

class ReviewsService {
  async createReviews({ payload, user_id }: { payload: CreateReviewReqBody; user_id: string }) {
    try {
      const orderId = payload.oid
      const tid = payload.tid
      const [result] = await Promise.all([
        Review.create({
          _id: uuidv4(),
          uid: user_id,
          ...payload,
          date: new Date()
        }),
        OrderDetails.update(
          { reviews_status: ReviewsStatus.Reviewed, updated_at: new Date() },
          {
            where: {
              oid: orderId,
              tid: tid
            }
          }
        )
      ])
      return result
    } catch (error) {
      console.log(error)
      throw new Error('Error: ' + error)
    }
  }

  async getAllReviews() {
    try {
      const reviews = await Review.findAll()
      return {
        data: reviews
      }
    } catch (error) {
      console.log(error)
      return {
        error: error
      }
    }
  }

  async getReviews(user_id: string) {
    try {
      const reviews = await Review.findAll({ where: { uid: user_id } })
      return {
        data: reviews
      }
    } catch (error) {
      console.log(error)
      return {
        error: error
      }
    }
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
