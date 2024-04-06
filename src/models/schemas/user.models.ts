import { DataTypes, Model, Sequelize } from 'sequelize'
import { UserVerifyStatus } from '~/constants/enums'

class User extends Model {
  private _id!: number
  private name!: string
  private email!: string
  private date_of_birth!: Date
  private password!: string
  private created_at!: Date
  private update_at!: Date
  private email_verify_token!: string
  private forgot_password_token!: string
  private verify!: UserVerifyStatus

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        _id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        update_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          onUpdate: 'CASCADE'
        },
        email_verify_token: {
          type: DataTypes.STRING
        },
        forgot_password_token: {
          type: DataTypes.STRING
        },
        verify: {
          type: DataTypes.ENUM,
          values: ['Unverified', 'Verified', 'Banned'],
          defaultValue: 'Unverified'
        }
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
        underscored: true,
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'update_at'
      }
    )
  }
}

export default User
