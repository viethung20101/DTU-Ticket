import User from '~/models/schemas/user.models'
import db from './database.services'
import { RegisterReqBody } from '~/models/Requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import RefreshToken from '~/models/schemas/refreshToken.models'
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

  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterReqBody) {
    try {
      const result = await User.create({
        ...payload,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
      const user_id = result.dataValues._id.toString()
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
    return Boolean(user)
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await RefreshToken.create({
      uid: user_id,
      token: refresh_token
    })
    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await RefreshToken.destroy({
      where: {
        token: refresh_token
      }
    })
  }

  async findOneUser(user_id: string) {
    return await db.User.findOne({ where: { _id: user_id } })
  }

  async verifyEmail(user_id: string) {
    const result = await User.update({ email_verify_token: '', update_at: new Date() }, { where: { id: user_id } })
  }
}

const usersService = new UsersService()
export default usersService
