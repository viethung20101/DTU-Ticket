import { v4 as uuidv4 } from 'uuid'
import OrderDetails from '~/models/schemas/orderDetails.models'
import Ticket from '~/models/schemas/ticket.models'
import db from './database.services'
import Order from '~/models/schemas/order.models'
import { OrderStatus } from '~/constants/enums'
import { Op, Sequelize, where } from 'sequelize'
import { USERS_MESSAGES } from '~/constants/messages'
import { CreateOrderDetailsReqBody } from '~/models/Requests/order.requests'

class OrdersService {
  async getOrder(_id: string) {
    const order = await Order.findByPk(_id)
    return order
  }

  async checkOrderExist(_id: string) {
    const order = await Order.findOne({ where: { _id: _id, status: OrderStatus.Unpaid } })
    return order
  }

  private isToday(usage_date: Date | string) {
    if (typeof usage_date === 'string') {
      usage_date = new Date(usage_date)
    }
    const today = new Date()
    const todayFix = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    const usageDate = Date.UTC(usage_date.getFullYear(), usage_date.getMonth(), usage_date.getDate())
    if (todayFix === usageDate) {
      return true
    }
    return false
  }

  private checkDate(usage_date: Date | string) {
    if (typeof usage_date === 'string') {
      usage_date = new Date(usage_date)
    }
    const today = new Date()
    const todayFix = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    const usageDate = Date.UTC(usage_date.getFullYear(), usage_date.getMonth(), usage_date.getDate())
    if (usageDate < todayFix) {
      return false
    }
    return true
  }

  async createOrders({ user_id, orderDetails }: { user_id: string; orderDetails: Array<CreateOrderDetailsReqBody> }) {
    let transaction
    try {
      transaction = await db.sequelize.transaction()
      const order = await Order.create(
        {
          _id: uuidv4(),
          uid: user_id,
          total_ticket: orderDetails.length,
          total_price: 0,
          date_order: new Date(),
          status: OrderStatus.Unpaid
        },
        { transaction }
      )

      let totalPrice = 0

      for (const detail of orderDetails) {
        const { tid, quantity, usage_date } = detail
        const quantityOrder = quantity as number
        const usageDate = usage_date as Date
        if (!this.checkDate(usageDate)) {
          throw new Error(USERS_MESSAGES.TICKET_USE_DATE_IS_INVALID)
        }
        const ticket = await Ticket.findByPk(tid, { transaction, lock: true })
        if (!ticket) {
          throw new Error(USERS_MESSAGES.TICKET_NOT_FOUND)
        }

        let totalQuantity: number
        const totalPurchased = await OrderDetails.findAll({
          attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity']],
          where: {
            tid: tid,
            usage_date: {
              [Op.eq]: usageDate
            }
          }
        })

        if (totalPurchased.length > 0 && totalPurchased[0].getDataValue('total_quantity') !== null) {
          totalQuantity = Number(totalPurchased[0].getDataValue('total_quantity'))
        } else {
          totalQuantity = 0
        }
        const remainingTickets = ticket.dataValues.default_daily_quota - totalQuantity
        if (remainingTickets < quantityOrder) {
          throw new Error(USERS_MESSAGES.TICKET_NOT_INSUFFICIENT_QUANTITY)
        }
        const itemPrice = ticket.dataValues.price * quantityOrder
        totalPrice += itemPrice

        if (this.isToday(usageDate)) {
          const daily_quota = ticket.dataValues.daily_quota - quantityOrder
          await ticket.update(
            { daily_quota: daily_quota, updated_at: new Date() },
            { where: { _id: ticket.dataValues._id }, transaction }
          )
        }

        await OrderDetails.create(
          {
            _id: uuidv4(),
            oid: order.dataValues._id,
            tid: tid,
            quantity: quantityOrder,
            price: ticket.dataValues.price,
            usage_date: usageDate
          },
          { transaction }
        )
      }
      await order.update({ total_price: totalPrice }, { transaction })
      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
      throw error
    }
  }
}

const ordersService = new OrdersService()
export default ordersService
