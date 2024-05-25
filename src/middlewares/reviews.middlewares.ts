import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { OrderStatus, ReviewsStatus } from '~/constants/enums'
import { PAYMENTS_MESSAGES, REVIEWS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/Requests/user.requests'
import Order from '~/models/schemas/order.models'
import OrderDetails from '~/models/schemas/orderDetails.models'
import ordersService from '~/services/orders.services'
import ticketsService from '~/services/tickets.services'
import { validate } from '~/utils/validation'

export const createReviewsValidator = validate(
  checkSchema(
    {
      oid: {
        isString: {
          errorMessage: PAYMENTS_MESSAGES.ORDER_ID_MUST_BE_A_STRING
        },
        notEmpty: {
          errorMessage: PAYMENTS_MESSAGES.ORDER_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const { user_id } = req.decoded_authorization as TokenPayload
            const isOrderExist = await ordersService.checkOrderExist({
              order_id: value,
              user_id: user_id,
              status: OrderStatus.Paid
            })
            console.log(value, user_id, OrderStatus.Paid)
            if (isOrderExist == null) {
              throw new Error(PAYMENTS_MESSAGES.ORDER_NOT_FOUND)
            }
            req.oid = value
            return true
          }
        }
      },
      tid: {
        isString: {
          errorMessage: USERS_MESSAGES.ID_MUST_BE_A_STRING
        },
        notEmpty: {
          errorMessage: USERS_MESSAGES.TICKET_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isGroupExist = await ticketsService.checkTicketExist(value)
            if (!isGroupExist) {
              throw new Error(USERS_MESSAGES.TICKET_NOT_FOUND)
            }
            const oid = req.oid
            const orderDetails = await OrderDetails.findOne({ where: { tid: value, oid: oid } })
            if (orderDetails?.dataValues.reviews_status !== ReviewsStatus.CanReview) {
              throw new Error(REVIEWS_MESSAGES.CANNOT_REVIEW_THIS_TICKET)
            }
            return true
          }
        }
      },
      rating: {
        isNumeric: {
          errorMessage: REVIEWS_MESSAGES.RATING_MUST_BE_A_NUMERIC
        },
        notEmpty: {
          errorMessage: REVIEWS_MESSAGES.RATING_IS_REQUIRED
        },
        isInt: {
          errorMessage: REVIEWS_MESSAGES.RATING_MUST_BE_AN_INTEGER
        },
        custom: {
          options: async (value) => {
            if (value < 1 || value > 5) {
              throw new Error(REVIEWS_MESSAGES.RATING_OUT_OF_RANGE)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
