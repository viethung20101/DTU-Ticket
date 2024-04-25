import { DataTypes, Model, Sequelize } from 'sequelize'
import Order from './order.models'
import Ticket from './ticket.models'

class OrderDetails extends Model {
  public _id!: string
  public oid!: string
  public tid!: string
  public quantity!: number
  public price!: number
  public usage_date!: Date
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
        usage_date: {
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
