import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import USERS_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/utils/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import groupTicketsService from '~/services/groupTickets.services'

const idSchema: ParamSchema = {
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
    errorMessage: USERS_MESSAGES.NAME_OF_GROUP_TICKETS_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_OF_GROUP_TICKETS_MUST_BE_A_STRING
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

export const createGroupValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      short_description: shortDescriptionSchema,
      description: descriptionSchema,
      date_start: dateStartSchema,
      date_end: dateEndSchema
    },
    ['body']
  )
)

export const updateGroupValidator = validate(
  checkSchema(
    {
      id: idSchema,
      name: {
        optional: true,
        ...nameSchema,
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

export const deleteGroupValidator = validate(
  checkSchema(
    {
      id: idSchema
    },
    ['body']
  )
)
