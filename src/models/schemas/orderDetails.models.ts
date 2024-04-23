import { DataTypes, Model, Sequelize } from 'sequelize'
import Order from './order.models'
import Ticket from './ticket.models'

class OrderDetails extends Model {
  private _id!: string
  private oid!: string
  private tid!: string
  private quantity!: number
  private price!: number
  private ticket_usage_date!: Date
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
        oid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        tid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        ticket_usage_date: {
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
        modelName: 'OrderDetails',
        timestamps: true,
        underscored: true,
        tableName: 'order_details',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(Order, { foreignKey: 'oid', as: 'orders' })
    this.belongsTo(Ticket, { foreignKey: 'tid', as: 'tickets' })
  }
}

export default OrderDetails
