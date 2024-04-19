import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import USERS_MESSAGES from '~/constants/messages'
import groupTicketsService from '~/services/groupTickets.services'
import ticketsService from '~/services/tickets.services'

const idSchema: ParamSchema = {
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
      req.id = value
      return true
    }
  }
}

const codeTicketSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.CODE_TICKET_MUST_BE_A_STRING
  },
  trim: true
}

const gidSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.GROUP_ID_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const isGroupExist = await groupTicketsService.checkGroupExist(value)
      if (!isGroupExist) {
        throw new Error(USERS_MESSAGES.GROUP_NOT_FOUND)
      }
      req.id = value
      return true
    }
  }
}

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_OF_TICKET_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_OF_TICKET_MUST_BE_A_STRING
  },
  trim: true
}

const priceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PRICE_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: USERS_MESSAGES.PRICE_IS_NOT_NUMERIC
  }
}

const dayOfWeekSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.DAY_OF_WEEK_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.DAY_OF_WEEK_MUST_BE_A_STRING
  },
  trim: true
}

const shortDescriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.SHORT_DESCRIPTION_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.SHORT_DESCRIPTION_MUST_BE_A_STRING
  },
  trim: true
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.DESCRIPTION_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
  },
  trim: true
}

const colorSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.COLOR_MUST_BE_A_STRING
  },
  trim: true
}

const cardTypeSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CARD_TYPE_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CARD_TYPE_MUST_BE_A_STRING
  },
  trim: true
}

const dateStartSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true
    },
    errorMessage: USERS_MESSAGES.INCORRECT_DATE_FORMAT
  }
}

const dateEndSchema: ParamSchema = {
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

export const createTicketValidator = validate(
  checkSchema(
    {
      gid: gidSchema,
      name: nameSchema,
      price: priceSchema,
      day_of_week: dayOfWeekSchema,
      short_description: shortDescriptionSchema,
      description: descriptionSchema,
      color: colorSchema,
      card_type: cardTypeSchema,
      date_start: dateStartSchema,
      date_end: dateEndSchema
    },
    ['body']
  )
)

export const updateTicketValidator = validate(
  checkSchema(
    {
      id: idSchema,
      gid: {
        optional: true,
        ...gidSchema,
        notEmpty: undefined
      },
      name: {
        optional: true,
        ...nameSchema,
        notEmpty: undefined
      },
      price: {
        optional: true,
        ...priceSchema,
        notEmpty: undefined
      },
      day_of_week: {
        optional: true,
        ...dayOfWeekSchema,
        notEmpty: undefined
      },
      short_description: {
        optional: true,
        ...shortDescriptionSchema,
        notEmpty: undefined
      },
      description: {
        optional: true,
        ...descriptionSchema,
        notEmpty: undefined
      },
      color: {
        optional: true,
        ...colorSchema
      },
      card_type: {
        optional: true,
        ...cardTypeSchema
      },
      date_start: {
        optional: true,
        ...dateStartSchema
      },
      date_end: {
        optional: true,
        ...dateEndSchema
      }
    },
    ['body']
  )
)

export const deleteTicketValidator = validate(
  checkSchema(
    {
      id: idSchema
    },
    ['body']
  )
)
