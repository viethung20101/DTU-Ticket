import dbConfig from '~/config/database.configs'
import { Sequelize } from 'sequelize'
import User from '~/models/schemas/user.models'
import GroupTicket from '~/models/schemas/groupTicket.models'
import Ticket from '~/models/schemas/ticket.models'
import RefreshToken from '~/models/schemas/refreshToken.models'
import Cart from '~/models/schemas/cart.models'

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
  Cart: typeof Cart
}

const db: DbInterface = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User: User,
  GroupTicket: GroupTicket,
  Ticket: Ticket,
  RefreshToken: RefreshToken,
  Cart: Cart
}

User.initialize(sequelize)
GroupTicket.initialize(sequelize)
Ticket.initialize(sequelize)
RefreshToken.initialize(sequelize)
Cart.initialize(sequelize)

export default db
