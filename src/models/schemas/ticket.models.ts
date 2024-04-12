import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'
import GroupTicket from './groupTicket.models'
import TicketDetails from './ticketDetails.models'

class Ticket extends Model {
  private _id!: number
  private code_ticket!: string
  private gid!: number
  private name!: string
  private short_name!: string
  private card_type!: string
  private date_start!: Date
  private date_end!: Date
  private activated!: ActivatedStatus
  private shown!: ShownStatus
  private note!: string
  private created_at!: Date
  private update_at!: Date

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        _id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        code_ticket: {
          type: DataTypes.STRING,
          allowNull: true
        },
        gid: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        short_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        card_type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        date_start: {
          type: DataTypes.DATE,
          allowNull: true
        },
        date_end: {
          type: DataTypes.DATE,
          allowNull: true
        },
        activated: {
          type: DataTypes.ENUM,
          values: ['Activated', 'NotActivated'],
          defaultValue: 'Activated'
        },
        shown: {
          type: DataTypes.ENUM,
          values: ['Shown', 'NotShown'],
          defaultValue: 'Shown'
        },
        note: {
          type: DataTypes.STRING,
          allowNull: true
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
        modelName: 'Ticket',
        timestamps: true,
        underscored: true,
        tableName: 'tickets',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(GroupTicket, { foreignKey: 'gid', as: 'group_tickets' })
  }
  static associate() {
    this.hasOne(TicketDetails)
  }
}

export default Ticket
