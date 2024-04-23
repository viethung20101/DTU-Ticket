import User from '~/models/schemas/user.models'
import db from './database.services'
import { RegisterReqBody } from '~/models/Requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType, UserVerifyStatus, RoleType } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import RefreshToken from '~/models/schemas/refreshToken.models'
import { v4 as uuidv4 } from 'uuid'
import { sendVerifyEmail } from '~/utils/email'
import { Op, where } from 'sequelize'

class UsersService {
  private signAccessToken({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: RoleType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify,
        role
      },
      privateKey: process.env.JWT_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: RoleType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        role
      },
      privateKey: process.env.JWT_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    verify,
    role
  }: {
    user_id: string
    verify: UserVerifyStatus
    role: RoleType
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify, role })
    ])
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqBody) {
    try {
      const user_id = uuidv4()
      const email_verify_token = await this.signEmailVerifyToken({
        user_id: user_id,
        verify: UserVerifyStatus.Unverified
      })
      await User.create({
        ...payload,
        _id: user_id,
        email_verify_token: email_verify_token,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth),
        role: 'User'
      })
      // const user_id = result.dataValues._id.toString()
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user_id,
        verify: UserVerifyStatus.Unverified,
        role: RoleType.User
      })
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      // await sendVerifyEmail(
      //   payload.email,
      //   'Verify your email',
      //   '<h1>Verify your Email</h1><p>Click <a href="' +
      //     process.env.CLIENT_URL +
      //     '/verify-email=' +
      //     email_verify_token +
      //     '">here</a> to verify email</p>'
      // )
      return {
        access_token,
        refresh_token,
        role: 'User'
      }
    } catch (error) {
      throw new Error('Error while registering user: ' + error)
    }
  }

  async checkEmailExist(email: string) {
    const user = await db.User.findOne({
      where: { email: email }
    })
    return user
  }

  async login({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: RoleType }) {
    try {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id,
        verify,
        role
      })
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      return {
        access_token,
        refresh_token,
        role
      }
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async logout(refresh_token: string) {
    try {
      await RefreshToken.destroy({
        where: {
          token: refresh_token
        }
      })
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async refreshToken({
    user_id,
    verify,
    role,
    old_refresh_token
  }: {
    user_id: string
    verify: UserVerifyStatus
    role: RoleType
    old_refresh_token: string
  }) {
    try {
      const [token] = await Promise.all([
        this.signAccessAndRefreshToken({
          user_id,
          verify,
          role
        }),
        RefreshToken.destroy({ where: { token: old_refresh_token } })
      ])
      const [access_token, refresh_token] = token
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      return {
        access_token,
        refresh_token,
        role
      }
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async findOneUser(user_id: string) {
    return await User.findByPk(user_id)
  }

  async verifyEmail(user_id: string, role: RoleType) {
    try {
      const [token] = await Promise.all([
        this.signAccessAndRefreshToken({
          user_id,
          verify: UserVerifyStatus.Verified,
          role
        }),
        User.update(
          { email_verify_token: '', updated_at: new Date(), verify: UserVerifyStatus.Verified },
          { where: { id: user_id } }
        )
      ])
      const [access_token, refresh_token] = token
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      return {
        access_token,
        refresh_token,
        role
      }
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Verified
    })
    User.update({ email_verify_token: email_verify_token, updated_at: new Date() }, { where: { id: user_id } })
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    try {
      const forgot_password_token = await this.signForgotPasswordToken({
        user_id,
        verify
      })
      await User.update(
        { forgot_password_token: forgot_password_token, updated_at: new Date() },
        { where: { _id: user_id } }
      )
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async resetPassword(user_id: string, password: string) {
    try {
      User.update(
        { forgot_password_token: '', password: hashPassword(password), updated_at: new Date() },
        { where: { id: user_id } }
      )
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async getMe(user_id: string) {
    return await db.User.findOne({
      where: { _id: user_id },
      attributes: { exclude: ['id', 'password', 'email_verify_token', 'forgot_password_token'] }
    })
  }

  async changePassword(user_id: string, new_password: string) {
    await User.update({ password: hashPassword(new_password), updated_at: new Date() }, { where: { _id: user_id } })
  }

  async setRole(user_id: string, role: RoleType) {
    try {
      await User.update({ role: role, updated_at: new Date() }, { where: { _id: user_id } })
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async getUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password', 'email_verify_token', 'forgot_password_token'] },
        where: {
          role: {
            [Op.or]: [RoleType.Admin, RoleType.User]
          }
        },
        order: [['_id', 'ASC']]
      })
      return {
        data: users
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }
}

const usersService = new UsersService()
export default usersService
