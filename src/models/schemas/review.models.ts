import { DataTypes, Model, Sequelize } from 'sequelize'
import { ActivatedStatus, ShownStatus } from '~/constants/enums'
import User from './user.models'
import Ticket from './ticket.models'

class Review extends Model {
  private _id!: string
  private uid!: string
  private tid!: string
  private rating!: number
  private comment!: Text
  private date!: Date
  private activated!: ActivatedStatus
  private shown!: ShownStatus
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
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        activated: {
          type: DataTypes.ENUM(ActivatedStatus.Activated, ActivatedStatus.NotActivated),
          defaultValue: ActivatedStatus.Activated
        },
        shown: {
          type: DataTypes.ENUM(ShownStatus.Shown, ShownStatus.NotShown),
          defaultValue: ShownStatus.Shown
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
        modelName: 'Review',
        timestamps: true,
        underscored: true,
        tableName: 'reviews',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(User, { foreignKey: 'uid', as: 'users' })
    this.belongsTo(Ticket, { foreignKey: 'tid', as: 'tickets' })
  }
}

export default Review
