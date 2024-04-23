import { DataTypes, Model, Sequelize } from 'sequelize'
import Order from './order.models'
import { PaymentMethod } from '~/constants/enums'

class Payment extends Model {
  private _id!: string
  private oid!: string
  private payment_method!: PaymentMethod
  private total_price!: number
  private payment_date!: Date
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
        payment_method: {
          type: DataTypes.ENUM(PaymentMethod.BankTransfer, PaymentMethod.VNPAY, PaymentMethod.VNPAYQR),
          defaultValue: PaymentMethod.VNPAY
        },
        total_price: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        payment_date: {
          type: DataTypes.DATE,
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
        modelName: 'Payment',
        timestamps: true,
        underscored: true,
        tableName: 'payments',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(Order, { foreignKey: 'oid', as: 'orders' })
  }
}

export default Payment