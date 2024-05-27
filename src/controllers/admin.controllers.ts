import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { SetRoleReqBody } from '~/models/Requests/admin.requests'
import { TokenPayload } from '~/models/Requests/user.requests'
import usersService from '~/services/users.services'

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await usersService.getUsers(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
    result
  })
}

export const getAdminController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await usersService.getAdmin(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_ADMIN_SUCCESS,
    result
  })
}

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await usersService.getUsers(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
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

export const banAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { verify } = req.body
  const result = await usersService.banAllUsers({ id: id, verify: verify })
  return res.json({
    message: USERS_MESSAGES.BAN_USER_SUCCESS,
    result
  })
}

export const banUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { verify } = req.body
  const result = await usersService.banUsers({ id: id, verify: verify })
  return res.json({
    message: USERS_MESSAGES.BAN_USER_SUCCESS,
    result
  })
}
