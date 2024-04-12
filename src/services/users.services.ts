import User from '~/models/schemas/user.models'
import db from './database.services'
import { RegisterReqBody } from '~/models/Requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import RefreshToken from '~/models/schemas/refreshToken.models'
import { v4 as uuidv4 } from 'uuid'
import USERS_MESSAGES from '~/constants/messages'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
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
      const email_verify_token = await this.signEmailVerifyToken(user_id)
      await User.create({
        ...payload,
        _id: user_id,
        email_verify_token: email_verify_token,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
      // const user_id = result.dataValues._id.toString()
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      return {
        access_token,
        refresh_token
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

  async login(user_id: string) {
    try {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
      await RefreshToken.create({
        uid: user_id,
        token: refresh_token
      })
      return {
        access_token,
        refresh_token
      }
    } catch (error) {
      throw new Error(USERS_MESSAGES.ERROR)
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
      throw new Error(USERS_MESSAGES.ERROR)
    }
  }

  async findOneUser(user_id: string) {
    return await db.User.findOne({ where: { _id: user_id } })
  }

  async verifyEmail(user_id: string) {
    try {
      const [token] = await Promise.all([
        this.signAccessAndRefreshToken(user_id),
        User.update({ email_verify_token: '', updated_at: new Date(), verify: 'Verified' }, { where: { id: user_id } })
      ])
      const [access_token, refresh_token] = token
      return {
        access_token,
        refresh_token
      }
    } catch (error) {
      throw new Error(USERS_MESSAGES.ERROR)
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    User.update({ email_verify_token: email_verify_token, updated_at: new Date() }, { where: { id: user_id } })
  }

  async forgotPassword(user_id: string) {
    try {
      const forgot_password_token = await this.signForgotPasswordToken(user_id)
      await User.update(
        { forgot_password_token: forgot_password_token, updated_at: new Date() },
        { where: { _id: user_id } }
      )
    } catch (error) {
      throw new Error(USERS_MESSAGES.ERROR)
    }
  }

  async resetPassword(user_id: string, password: string) {
    try {
      User.update(
        { forgot_password_token: '', password: hashPassword(password), updated_at: new Date() },
        { where: { id: user_id } }
      )
    } catch (error) {
      throw new Error(USERS_MESSAGES.ERROR)
    }
  }

  async getMe(user_id: string) {
    return await db.User.findOne({
      where: { _id: user_id },
      attributes: { exclude: ['password', 'email_verify_token', 'forgot_password_token'] }
    })
  }
}

const usersService = new UsersService()
export default usersService
