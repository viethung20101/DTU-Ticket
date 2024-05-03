import { ParamSchema, checkSchema } from 'express-validator'
import { PaymentMethod } from '~/constants/enums'
import { PAYMENTS_MESSAGES } from '~/constants/messages'
import ordersService from '~/services/orders.services'
import { validate } from '~/utils/validation'

export const createPaymentUrlValidator = validate(
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
            const isOrderExist = await ordersService.checkOrderExist(value)
            if (isOrderExist == null) {
              throw new Error(PAYMENTS_MESSAGES.ORDER_NOT_FOUND)
            }
            return true
          }
        }
      },
      bankCode: {
        isString: {
          errorMessage: PAYMENTS_MESSAGES.PAYMENT_METHOD_MUST_BE_A_STRING
        },
        notEmpty: {
          errorMessage: PAYMENTS_MESSAGES.PAYMENT_METHOD_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            if (value != PaymentMethod.VNBANK && value != PaymentMethod.VNPAYQR && value != PaymentMethod.INTCARD) {
              throw new Error(PAYMENTS_MESSAGES.PAYMENT_METHOD_IS_INVALID)
            }
            return true
          }
        }
      },
      language: {
        isString: {
          errorMessage: PAYMENTS_MESSAGES.LANGUAGE_MUST_BE_A_STRING
        },
        notEmpty: {
          errorMessage: PAYMENTS_MESSAGES.LANGUAGE_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            if (value != 'vn' && value != 'en') {
              throw new Error(PAYMENTS_MESSAGES.LANGUAGE_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)