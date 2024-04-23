import { DataTypes, Model, Sequelize } from 'sequelize'
import User from './user.models'
import { OrderStatus } from '~/constants/enums'

class Order extends Model {
  private _id!: string
  private uid!: string
  private total_ticket!: number
  private total_price!: number
  private date_order!: Date
  private status!: OrderStatus
  private created_at!: Date
  private update_at!: Date

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
        total_ticket: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        total_price: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        date_order: {
          type: DataTypes.DATE,
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM(OrderStatus.Paid, OrderStatus.Unpaid, OrderStatus.Canceled),
          defaultValue: OrderStatus.Unpaid
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
        modelName: 'Order',
        timestamps: true,
        underscored: true,
        tableName: 'orders',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(User, { foreignKey: 'uid', as: 'users' })
  }
}

export default Order
