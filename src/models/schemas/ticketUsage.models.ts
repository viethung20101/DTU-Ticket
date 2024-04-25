import { DataTypes, Model, Sequelize } from 'sequelize'
import User from './user.models'
import Ticket from './ticket.models'
import { TicketUsageStatus } from '~/constants/enums'

class TicketUsage extends Model {
  private _id!: string
  private uid!: string
  private tid!: string
  private usage_date!: Date
  private status!: TicketUsageStatus
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
        tid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        usage_date: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM(TicketUsageStatus.Used, TicketUsageStatus.Unused, TicketUsageStatus.Expired),
          defaultValue: TicketUsageStatus.Unused
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
        modelName: 'TicketUsage',
        timestamps: true,
        underscored: true,
        tableName: 'ticket_usages',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(User, { foreignKey: 'uid', as: 'users' })
    this.belongsTo(Ticket, { foreignKey: 'tid', as: 'tickets' })
  }
}

export default TicketUsage
