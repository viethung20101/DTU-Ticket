import { Request, Response, NextFunction } from 'express'
import USERS_MESSAGES from '~/constants/messages'
import ticketsService from '~/services/tickets.services'

export const getTicketsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, size } = req.query
  const result = await ticketsService.getTickets({ page: parseInt(page as string), size: parseInt(size as string) })
  return res.json({
    message: USERS_MESSAGES.GET_ALL_TICKETS_SUCCESS,
    result
  })
}
