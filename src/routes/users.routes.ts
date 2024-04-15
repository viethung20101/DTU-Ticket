import { Router } from 'express'
import {
  loginValidator,
  registorValidator,
  accessTokenValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordTokenValidator,
  resetPasswordValidator,
  verifiedUserValidator
} from '../middlewares/users.middlewares'
import {
  registerController,
  loginController,
  logoutController,
  emailVerifyController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  getMeController,
  oauthController
} from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

usersRouter.post('/oauth/google', wrapRequestHandler(oauthController))

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

usersRouter.post('/register', registorValidator, wrapRequestHandler(registerController))

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

export default usersRouter
