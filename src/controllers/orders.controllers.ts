import { Request, Response, NextFunction } from 'express'
import { TokenPayload } from '~/models/Requests/user.requests'
import ordersService from '~/services/orders.services'

export const createOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { orderDetails } = req.body
  const result = await ordersService.createOrders({ user_id, orderDetails })
  return res.json(result)
}

export const getOrderController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { order_id } = req.query
  const result = await ordersService.userGetOrder({ user_id: user_id, order_id: order_id as string })
  return res.json(result)
}
