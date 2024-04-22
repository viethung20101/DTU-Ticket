import { config } from 'dotenv'
import { Dialect, Options } from 'sequelize'

config()

const dbConfig = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USERNAME || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '123',
  DB: process.env.DB_NAME || 'testdb',
  dialect: 'postgres' as Dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false as unknown as Options['operatorsAliases']
}

export default dbConfig
