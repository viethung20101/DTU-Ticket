import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'
import GroupTicket from './groupTicket.models'
import { Media } from '../others'

class Ticket extends Model {
  private _id!: string
  private code_ticket!: string
  private gid!: string
  private name!: string
  private price!: number
  private day_of_week!: string
  private short_description!: Text
  private description!: Text
  private color!: string
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
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
        },
        code_ticket: {
          type: DataTypes.STRING,
          allowNull: true
        },
        gid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        day_of_week: {
          type: DataTypes.STRING,
          allowNull: false
        },
        short_description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true
        },
        card_type: {
          type: DataTypes.STRING,
          allowNull: false
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
}

export default Ticket
