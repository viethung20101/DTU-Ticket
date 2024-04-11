import { Request } from 'express'
import User from './models/schemas/user.models'
import { TokenPayload } from '~/models/Requests/user.requests'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
