import { Request, Response, NextFunction, application } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import ticketsService from '~/services/tickets.services'
import { CreateTicketReqBody, UpdateTicketReqBody } from '~/models/Requests/ticket.requests'

export const getTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, size } = req.query
  const result = await ticketsService.getTickets(req.query)
  // const result = await ticketsService.getTickets({ page: parseInt(page as string), size: parseInt(size as string) })
  return res.json({
    message: USERS_MESSAGES.GET_ALL_TICKETS_SUCCESS,
    result
  })
}

export const getTicketDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query
  const result = await ticketsService.getTicketDetails(id as string)
  return res.json({
    message: USERS_MESSAGES.GET_TICKET_DETAILS_SUCCESS,
    result
  })
}

export const getAllTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await ticketsService.getAllTickets(req.query)
  return res.json({
    message: USERS_MESSAGES.GET_ALL_TICKETS_SUCCESS,
    result
  })
}

export const createTicketsController = async (
  req: Request<ParamsDictionary, any, CreateTicketReqBody>,
  res: Response,
  next: NextFunction
) => {
  await ticketsService.createTicket(req.body)
  return res.json({
    message: USERS_MESSAGES.CREATE_TICKET_SUCCESS
  })
}

export const updateTicketController = async (
  req: Request<ParamsDictionary, any, UpdateTicketReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { body } = req
  await ticketsService.updateTicket(body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_TICKET_SUCCESS
  })
}

export const deleteTicketController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  await ticketsService.deleteTicket(id)
  return res.json({
    message: USERS_MESSAGES.DELETE_TICKET_SUCCESS
  })
}

export const changeStatusTicketController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { shown } = req.body
  const result = await ticketsService.changeStatusTicket({ id: id, shown: shown })
  return res.json({
    message: USERS_MESSAGES.CHANGE_STATUS_SUCCESS,
    result
  })
}
