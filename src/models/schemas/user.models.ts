import { DataTypes, Model, Sequelize } from 'sequelize'
import { UserVerifyStatus } from '~/constants/enums'

class User extends Model {
  public _id!: string
  public name!: string
  public email!: string
  public date_of_birth!: Date
  public password!: string
  public email_verify_token!: string
  public forgot_password_token!: string
  public verify!: UserVerifyStatus
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
        modelName: 'User',
        timestamps: true,
        underscored: true,
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    )
  }
}

export default User
