import { DataTypes, Model, Sequelize } from 'sequelize'
import User from './user.models'
import { OrderStatus } from '~/constants/enums'

class Order extends Model {
  public _id!: string
  public uid!: string
  public total_ticket!: number
  public total_price!: number
  public date_order!: Date
  public status!: OrderStatus
  public created_at!: Date
  public update_at!: Date

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
