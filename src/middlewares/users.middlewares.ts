import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import usersService from '~/services/users.services'
import USERS_MESSAGES from '~/constants/messages'
import db from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/utils/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { TokenPayload } from '~/models/Requests/user.requests'
import { UserVerifyStatus } from '~/constants/enums'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 6,
      max: 30
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_30
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_IS_TOO_WEEK
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH_PASSWORD
  },
  isLength: {
    options: {
      min: 6,
      max: 30
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH_PASSWORD
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH_PASSWORD
  },
  custom: {
    options: (value, { req }) => {
      if (value != req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH_PASSWORD)
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_RIQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_MUST_BE_A_STRING
  },
  custom: {
    options: async (value: string, { req }) => {
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decoded_forgot_password_token
        const user = await db.User.findOne({ where: { _id: user_id } })
        if (user == null) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.dataValues.forgot_password_token != value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize(error.message),
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}

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
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 1007
          },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_INVALID
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
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
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
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_RIQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_RIQUIRED,
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
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
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
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_RIQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_MUST_BE_A_STRING
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
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
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
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await usersService.checkEmailExist(value)
            if (!user) {
              throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify != 'Verified') {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}
