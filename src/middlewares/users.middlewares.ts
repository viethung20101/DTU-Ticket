import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import usersService from '~/services/users.services'
import USERS_MESSAGES from '~/constants/messages'
import db from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/utils/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await db.User.findOne({
              where: { email: value, password: hashPassword(req.body.password) }
            })
            if (user == null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isLength: {
          options: {
            min: 6,
            max: 30
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        }
      }
    },
    ['body']
  )
)

export const registorValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: new Error(USERS_MESSAGES.NAME_IS_REQUIRED)
        },
        isString: {
          errorMessage: new Error(USERS_MESSAGES.NAME_MUST_BE_A_STRING)
        },
        isLength: {
          options: {
            min: 1,
            max: 1007
          },
          errorMessage: new Error(USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100)
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: new Error(USERS_MESSAGES.EMAIL_IS_REQUIRED)
        },
        isEmail: {
          errorMessage: new Error(USERS_MESSAGES.EMAIL_INVALIDATE)
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await usersService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXIST)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: new Error(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
        },
        isLength: {
          options: {
            min: 6,
            max: 30
          },
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isLength: {
          options: {
            min: 6,
            max: 30
          },
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        custom: {
          options: (value, { req }) => {
            if (value != req.body.password) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isString: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (access_token == '') {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_ACCESS_TOKEN as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isString: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: process.env.JWT_REFRESH_TOKEN as string
                }),
                db.RefreshToken.findOne({
                  where: { token: value }
                })
              ])
              if (refresh_token == null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.UNAUTHORIZED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        isString: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.UNAUTHORIZED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_EMAIL_VERIFY_TOKEN as string
              })
              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.UNAUTHORIZED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
