import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import groupTicketsService from '../services/groupTickets.services'
import USERS_MESSAGES from '~/constants/messages'
import { CreateGroupReqBody } from '~/models/Requests/groupTicket.requests'

export const getGroupTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await groupTicketsService.getGroup()
  return res.json({
    message: USERS_MESSAGES.GET_ALL_TICKETS_SUCCESS,
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
