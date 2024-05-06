import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'
import GroupTicket from './groupTicket.models'
import Media from './media.models'

class Ticket extends Model {
  public _id!: string
  public code_ticket!: string
  public gid!: string
  public name!: string
  public price!: number
  public day_of_week!: string
  public default_daily_quota!: number
  public daily_quota!: number
  public last_reset_date!: Date
  public short_description!: Text
  // public description!: Text
  public overview!: Text
  public included_items!: Text
  public meeting_point!: Text
  public expectations!: Text
  public additional_info!: Text
  public cancellation_policy!: Text
  public color!: string
  public card_type!: string
  public date_start!: Date
  public date_end!: Date
  public activated!: ActivatedStatus
  public shown!: ShownStatus
  public note!: string
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
        default_daily_quota: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        daily_quota: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        last_reset_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        short_description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        // description: {
        //   type: DataTypes.TEXT,
        //   allowNull: false
        // },
        overview: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Tổng quan về tour'
        },
        included_items: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Các dịch vụ và tiện ích bao gồm trong tour'
        },
        meeting_point: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Điểm hẹn và đón khách'
        },
        expectations: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Những điều du khách có thể mong đợi từ tour'
        },
        additional_info: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Thông tin bổ sung về tour'
        },
        cancellation_policy: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Chính sách hủy tour'
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
          type: DataTypes.ENUM(ActivatedStatus.Activated, ActivatedStatus.NotActivated),
          defaultValue: ActivatedStatus.Activated
        },
        shown: {
          type: DataTypes.ENUM(ShownStatus.Shown, ShownStatus.NotShown),
          defaultValue: ShownStatus.Shown
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
