import dbConfig from '~/config/database.config'
import { Sequelize } from 'sequelize'
import User from '~/models/schemas/user.models'

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: dbConfig.operatorsAliases,
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
}

const db: DbInterface = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User: User
}

User.initialize(sequelize)

export default db
