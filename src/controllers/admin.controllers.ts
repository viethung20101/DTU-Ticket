import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import USERS_MESSAGES from '~/constants/messages'
import { SetRoleReqBody } from '~/models/Requests/admin.requests'
import usersService from '~/services/users.services'

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await usersService.getUsers()
  return res.json({
    message: USERS_MESSAGES.SET_ROLE_SUCCESS,
    result
  })
}

export const setRoleController = async (
  req: Request<ParamsDictionary, any, SetRoleReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body
  await usersService.setRole(id, role)
  return res.json({
    message: USERS_MESSAGES.SET_ROLE_SUCCESS
  })
}
