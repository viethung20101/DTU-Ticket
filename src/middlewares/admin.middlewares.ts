import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import USERS_MESSAGES from '~/constants/messages'
import { TokenPayload } from '~/models/Requests/user.requests'
import { ErrorWithStatus } from '~/utils/Errors'

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
