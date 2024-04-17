import { JwtPayload } from 'jsonwebtoken'
import { RoleType, TokenType } from '~/constants/enums'

export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  name: string
  email: string
  date_of_birth: Date
  password: string
  confirm_password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface verifyForgotPasswordTokenReqBody {
  refresh_token: string
}

export interface resetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  role_type: RoleType
}
