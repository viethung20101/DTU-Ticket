import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import moment from 'moment'
import crypto from 'crypto'
import querystring from 'qs'
import { createPaymentUrlReqBody } from '~/models/Requests/payment.requests'
import paymentsService from '~/services/payments.services'
import { TokenPayload } from '~/models/Requests/user.requests'

export const createPaymentUrlController = async (
  req: Request<ParamsDictionary, any, createPaymentUrlReqBody>,
  res: Response,
  next: NextFunction
) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const ipAddr =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.socket.remoteAddress || req.socket.remoteAddress

  const vnpUrl = await paymentsService.createPaymentUrl({
    payload: req.body,
    ipAddr: ipAddr as string
  })

  // res.redirect(vnpUrl as string)
  res.json({
    url: vnpUrl
  })
}

export const vnpayReturnController = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Hehehe')
  let vnp_Params = req.query
  const secureHash = vnp_Params['vnp_SecureHash']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)

  const tmnCode = process.env.vnp_TmnCode
  const secretKey = process.env.vnp_HashSecret as string

  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {
    return res.json({
      message: 'success',
      code: vnp_Params['vnp_ResponseCode']
    })
  } else {
    return res.json({
      message: 'success',
      code: '97'
    })
  }
}

export const vnpayIpnController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentsService.vnpayIpn(req.query)
  return res.json(result)
}

export const querydrController = async (req: Request, res: Response, next: NextFunction) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const date = new Date()

  const vnp_TmnCode = process.env.vnp_TmnCode
  const secretKey = process.env.vnp_HashSecret as string
  const vnp_Api = process.env.vnp_Api as string

  const vnp_TxnRef = req.body.orderId
  const vnp_TransactionDate = req.body.transDate

  const vnp_RequestId = moment(date).format('HHmmss')
  const vnp_Version = '2.1.0'
  const vnp_Command = 'querydr'
  const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef

  const vnp_IpAddr =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.socket.remoteAddress || req.socket.remoteAddress

  const currCode = 'VND'
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')

  const data =
    vnp_RequestId +
    '|' +
    vnp_Version +
    '|' +
    vnp_Command +
    '|' +
    vnp_TmnCode +
    '|' +
    vnp_TxnRef +
    '|' +
    vnp_TransactionDate +
    '|' +
    vnp_CreateDate +
    '|' +
    vnp_IpAddr +
    '|' +
    vnp_OrderInfo

  const hmac = crypto.createHmac('sha512', secretKey)
  const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex')

  const dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash
  }

  import('node-fetch').then((fetch) => {
    fetch
      .default(vnp_Api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
}

function sortObject(obj: any) {
  const sorted: any = {}
  const str = []
  let key
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}
