import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import ticketsService from '~/services/tickets.services'

export const createOrderValidator = validate(
  checkSchema(
    {
      orderDetails: {
        isArray: {
          errorMessage: USERS_MESSAGES.ORDER_DETAILS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: async (value) => {
            if (!value || value.length === 0) {
              throw new Error(USERS_MESSAGES.ORDER_DETAILS_ARE_REQUIRED)
            }
            for (const detail of value) {
              if (!detail.tid || !detail.quantity || !detail.usage_date) {
                throw new Error('Each order detail must include ticketId, quantity, and usageDate')
              }
              const ticket = await ticketsService.checkTicketExist(detail.tid)
              if (!ticket) {
                throw new Error(`Ticket with ID ${detail.tid} not found`)
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
