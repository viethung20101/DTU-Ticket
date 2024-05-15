import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import moment from 'moment'
import crypto from 'crypto'
import querystring from 'qs'
import { createPaymentUrlReqBody, querydrReqBody } from '~/models/Requests/payment.requests'
import paymentsService from '~/services/payments.services'
import { TokenPayload } from '~/models/Requests/user.requests'
import { PAYMENTS_MESSAGES } from '~/constants/messages'

export const createPaymentUrlController = async (
  req: Request<ParamsDictionary, any, createPaymentUrlReqBody>,
  res: Response,
  next: NextFunction
) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const ipAddr =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.socket.remoteAddress || req.socket.remoteAddress
  const { user_id } = req.decoded_authorization as TokenPayload
  const vnpUrl = await paymentsService.createPaymentUrl({
    payload: req.body,
    user_id: user_id,
    ipAddr: ipAddr as string
  })

  // res.redirect(vnpUrl as string)
  res.json({
    url: vnpUrl
  })
}

// export const vnpayReturnController = async (req: Request, res: Response, next: NextFunction) => {
//   let vnp_Params = req.query
//   const secureHash = vnp_Params['vnp_SecureHash']

//   delete vnp_Params['vnp_SecureHash']
//   delete vnp_Params['vnp_SecureHashType']

//   vnp_Params = sortObject(vnp_Params)

//   const tmnCode = process.env.vnp_TmnCode
//   const secretKey = process.env.vnp_HashSecret as string

//   const signData = querystring.stringify(vnp_Params, { encode: false })
//   const hmac = crypto.createHmac('sha512', secretKey)
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

//   if (secureHash === signed) {
//     return res.json({
//       message: 'success',
//       code: vnp_Params['vnp_ResponseCode']
//     })
//   } else {
//     return res.json({
//       message: 'success',
//       code: '97'
//     })
//   }
// }

export const vnpayIpnController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentsService.vnpayIpn(req.query)
  return res.json(result)
}

export const querydrController = async (
  req: Request<ParamsDictionary, any, querydrReqBody>,
  res: Response,
  next: NextFunction
) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const vnp_IpAddr =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.socket.remoteAddress || req.socket.remoteAddress

  const result = await paymentsService.querydr({ payload: req.body, vnp_IpAddr: vnp_IpAddr as string })
  return res.json(result)
}

// function sortObject(obj: any) {
//   const sorted: any = {}
//   const str = []
//   let key
//   for (key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       str.push(encodeURIComponent(key))
//     }
//   }
//   str.sort()
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
//   }
//   return sorted
// }

export const getAllPaymentsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentsService.getAllPayments()
  return res.json({
    message: PAYMENTS_MESSAGES.GET_ALL_PAYMENTS_SUCCESS,
    result
  })
}

export const getPaymentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await paymentsService.getPayments(user_id)
  return res.json({
    message: PAYMENTS_MESSAGES.GET_ALL_PAYMENTS_SUCCESS,
    result
  })
}
