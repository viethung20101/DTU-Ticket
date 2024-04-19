import { DataTypes, Model, Sequelize } from 'sequelize'
import User from './user.models'
import Ticket from './Ticket.models'

class Cart extends Model {
  private _id!: string
  private uid!: string
  private tid!: string
  private quantity!: number
  private date!: Date

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        _id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
        },
        uid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        tid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          onUpdate: 'CASCADE'
        }
      },
      {
        sequelize,
        modelName: 'Cart',
        timestamps: true,
        underscored: true,
        tableName: 'carts',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(User, { foreignKey: 'uid', as: 'users' })
    this.belongsTo(Ticket, { foreignKey: 'tid', as: 'tickets' })
  }
}

export default Ticket
