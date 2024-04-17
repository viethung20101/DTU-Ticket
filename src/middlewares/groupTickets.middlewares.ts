import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import USERS_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/utils/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const createValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_OF_GROUP_TICKETS_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_OF_GROUP_TICKETS_MUST_BE_A_STRING
        },
        trim: true
      },
      short_decription: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.SHORT_DESCRIPTION_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.SHORT_DESCRIPTION_MUST_BE_A_STRING
        },
        trim: true
      },
      description: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
        },
        trim: true
      },
      date_start: {
        isISO8601: {
          options: {
            strict: true
          },
          errorMessage: USERS_MESSAGES.INCORRECT_DATE_FORMAT
        }
      },
      date_end: {
        isISO8601: {
          options: {
            strict: true
          },
          errorMessage: USERS_MESSAGES.INCORRECT_DATE_FORMAT
        },
        custom: {
          options: (value, { req }) => {
            const startDate = new Date(req.body.date_start)
            const endDate = new Date(value)
            if (endDate <= startDate) {
              throw new Error(USERS_MESSAGES.END_DATE_MUST_BE_GREATER_THAN_START_DATE)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
