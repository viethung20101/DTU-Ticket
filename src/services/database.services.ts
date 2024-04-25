import dbConfig from '~/config/database.configs'
import { Sequelize } from 'sequelize'
import User from '~/models/schemas/user.models'
import GroupTicket from '~/models/schemas/groupTicket.models'
import Ticket from '~/models/schemas/ticket.models'
import RefreshToken from '~/models/schemas/refreshToken.models'
import Order from '~/models/schemas/order.models'
import OrderDetails from '~/models/schemas/orderDetails.models'
import Payment from '~/models/schemas/payment.models'
import Review from '~/models/schemas/review.models'
import Media from '~/models/schemas/media.models'
import TicketUsage from '~/models/schemas/ticketUsage.models'

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: dbConfig.operatorsAliases,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

interface DbInterface {
  Sequelize: typeof Sequelize
  sequelize: Sequelize
  User: typeof User
  GroupTicket: typeof GroupTicket
  Ticket: typeof Ticket
  RefreshToken: typeof RefreshToken
  Order: typeof Order
  OrderDetails: typeof OrderDetails
  Payment: typeof Payment
  Review: typeof Review
  Media: typeof Media
  TicketUsage: typeof TicketUsage
}

const db: DbInterface = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User: User,
  GroupTicket: GroupTicket,
  Ticket: Ticket,
  RefreshToken: RefreshToken,
  Order: Order,
  OrderDetails: OrderDetails,
  Payment: Payment,
  Review: Review,
  Media: Media,
  TicketUsage: TicketUsage
}

User.initialize(sequelize)
GroupTicket.initialize(sequelize)
Ticket.initialize(sequelize)
RefreshToken.initialize(sequelize)
Order.initialize(sequelize)
OrderDetails.initialize(sequelize)
Payment.initialize(sequelize)
Review.initialize(sequelize)
Media.initialize(sequelize)
TicketUsage.initialize(sequelize)

export default db
