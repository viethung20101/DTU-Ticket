import { Router } from 'express'
import {
  createPaymentUrlController,
  getPaymentsController,
  querydrController,
  vnpayIpnController
  // vnpayReturnController
} from '~/controllers/payments.controllers'
import { createPaymentUrlValidator } from '~/middlewares/payments.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const paymentsRouter = Router()

paymentsRouter.post(
  '/create_payment_url',
  accessTokenValidator,
  verifiedUserValidator,
  createPaymentUrlValidator,
  createPaymentUrlController
)

// paymentsRouter.get('/vnpay_return', vnpayReturnController)

paymentsRouter.get('/vnpay_ipn', vnpayIpnController)

paymentsRouter.post('/querydr', querydrController)

paymentsRouter.get('/list', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getPaymentsController))

export default paymentsRouter
