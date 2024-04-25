import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import USERS_MESSAGES from '~/constants/messages'
import { TokenPayload } from '~/models/Requests/user.requests'
import ordersService from '~/services/orders.services'

export const createOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { orderDetails } = req.body
  await ordersService.createOrders({ user_id, orderDetails })
  return res.json({
    message: USERS_MESSAGES.CREATE_TICKET_SUCCESS
  })
}
