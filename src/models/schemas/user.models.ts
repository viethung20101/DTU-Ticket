import { DataTypes, Model, Sequelize } from 'sequelize'
import { UserVerifyStatus, RoleType } from '~/constants/enums'

class User extends Model {
  public _id!: string
  public name!: string
  public email!: string
  public date_of_birth!: Date
  public password!: string
  public email_verify_token!: Text
  public forgot_password_token!: Text
  public role!: RoleType
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
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true
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
          type: DataTypes.TEXT
        },
        forgot_password_token: {
          type: DataTypes.TEXT
        },
        role: {
          type: DataTypes.ENUM(RoleType.SuperAdmin, RoleType.Admin, RoleType.User),
          defaultValue: RoleType.User
        },
        verify: {
          type: DataTypes.ENUM(UserVerifyStatus.Verified, UserVerifyStatus.Unverified, UserVerifyStatus.Banned),
          defaultValue: UserVerifyStatus.Unverified
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
