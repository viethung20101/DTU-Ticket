import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'
import USERS_MESSAGES from '~/constants/messages'
import { TokenPayload } from '~/models/Requests/user.requests'
import { ErrorWithStatus } from '~/utils/Errors'
import usersService from '~/services/users.services'

export const roleAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_authorization as TokenPayload
  if (role != 'SuperAdmin' && role != 'Admin') {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.ROLE_IS_NOT_ADMIN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }
  next()
}

export const roleSuperAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_authorization as TokenPayload
  if (role != 'SuperAdmin') {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.ROLE_IS_NOT_SUPER_ADMIN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }
  next()
}

export const setRoleValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.USER_ID_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            const user = await usersService.findOneUser(value)
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      },
      role: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ROLE_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            if (value != 'Admin' && value != 'User') {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ROLE_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
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
