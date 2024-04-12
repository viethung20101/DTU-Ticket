import { DataTypes, Model, Sequelize } from 'sequelize'
import User from './user.models'

class RefreshToken extends Model {
  public _id!: number
  public uid!: string
  public token!: string
  public created_at!: Date
  public update_at!: Date

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        _id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        uid: {
          type: DataTypes.STRING,
          allowNull: false
        },
        token: {
          type: DataTypes.STRING,
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
        modelName: 'RefreshToken',
        timestamps: true,
        underscored: true,
        tableName: 'refresh_tokens',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
    this.belongsTo(User, { foreignKey: 'uid', as: 'users' })
  }
}

export default RefreshToken
