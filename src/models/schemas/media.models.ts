import { DataTypes, Model, Sequelize } from 'sequelize'
import Ticket from './ticket.models'
import { MediaType } from '~/constants/enums'

class Media extends Model {
  private _id!: string
  private tid!: string
  private url!: string
  private type!: MediaType
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
        tid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.ENUM(MediaType.Image, MediaType.Video),
          defaultValue: MediaType.Image
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
        modelName: 'Media',
        timestamps: true,
        underscored: true,
        tableName: 'medias',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(Ticket, { foreignKey: 'tid', as: 'tickets' })
  }
}

export default Media
