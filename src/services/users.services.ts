import User from '~/models/schemas/user.models'
import db from './database.services'
import { RegisterReqBody } from '~/models/Requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType } from '~/constants/enums'
import { signToken } from '~/utils/jwt'

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
      privateKey: process.env.JWT_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqBody) {
    try {
      const emailExists = await this.checkEmailExist(payload.email)
      if (emailExists) {
        throw new Error('Email already exists')
      }
      const result = await User.create({
        ...payload,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
      const user_id = result.dataValues._id.toString()
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken(user_id),
        this.signRefreshToken(user_id)
      ])
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
}

const usersService = new UsersService()
export default usersService
