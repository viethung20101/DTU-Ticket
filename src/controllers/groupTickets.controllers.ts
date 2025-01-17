import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import groupTicketsService from '../services/groupTickets.services'
import { USERS_MESSAGES } from '~/constants/messages'
import { CreateGroupReqBody, UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'

export const getAllGroupTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await groupTicketsService.getAllGroup(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_GROUP_TICKETS_SUCCESS,
    result
  })
}

export const getGroupTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await groupTicketsService.getGroup()
  return res.json({
    message: USERS_MESSAGES.GET_GROUP_TICKETS_SUCCESS,
    result
  })
}

export const createGroupTicketsController = async (
  req: Request<ParamsDictionary, any, CreateGroupReqBody>,
  res: Response,
  next: NextFunction
) => {
  await groupTicketsService.createGroup(req.body)
  return res.json({
    message: USERS_MESSAGES.CREATE_GROUP_TICKET_SUCCESS
  })
}

export const updateGroupTicketsController = async (
  req: Request<ParamsDictionary, any, UpdateGroupReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { body } = req
  await groupTicketsService.updateGroup(body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_GROUP_TICKET_SUCCESS
  })
}

export const deleteGroupTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  await groupTicketsService.deleteGroup(id)
  return res.json({
    message: USERS_MESSAGES.DELETE_GROUP_TICKET_SUCCESS
  })
}

export const changeStatusGroupController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { shown } = req.body
  const result = await groupTicketsService.changeStatusGroup({ id: id, shown: shown })
  return res.json({
    message: USERS_MESSAGES.CHANGE_STATUS_SUCCESS,
    result
  })
}
