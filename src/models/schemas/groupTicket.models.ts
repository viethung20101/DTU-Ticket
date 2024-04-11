import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'

class GroupTicket extends Model {
  private _id!: number
  private code_gticket!: string
  private name!: string
  private short_decription!: string
  private description!: Text
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
        code_gticket: {
          type: DataTypes.STRING,
          allowNull: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        short_decription: {
          type: DataTypes.STRING,
          allowNull: true
        },
        decription: {
          type: DataTypes.TEXT,
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
        update_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          onUpdate: 'CASCADE'
        }
      },
      {
        sequelize,
        modelName: 'GroupTicket',
        timestamps: true,
        underscored: true,
        tableName: 'group_tickets',
        createdAt: 'created_at',
        updatedAt: 'update_at'
      }
    )
  }
}

export default GroupTicket