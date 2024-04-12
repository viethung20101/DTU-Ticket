import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'
import Ticket from './ticket.models'

class TicketDetails extends Model {
  private _id!: number
  private price!: number
  private day_of_week!: string
  private short_description!: string
  private description!: Text
  private color!: string
  private card_type!: string
  private activated!: ActivatedStatus
  private shown!: ShownStatus
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
        price: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        day_of_week: {
          type: DataTypes.STRING,
          allowNull: true
        },
        short_description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        decription: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        color: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        card_type: {
          type: DataTypes.STRING,
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
        modelName: 'TicketDetails',
        timestamps: true,
        underscored: true,
        tableName: 'ticket_details',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
  }
  static associate() {
    this.belongsTo(Ticket)
  }
}

export default TicketDetails
