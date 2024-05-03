import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import crypto from 'crypto'
import { createPaymentUrlReqBody } from '~/models/Requests/payment.requests'
import ordersService from './orders.services'
import querystring from 'qs'
import Payment from '~/models/schemas/payment.models'
import { OrderStatus, PaymentStatus } from '~/constants/enums'
import Order from '~/models/schemas/order.models'

class PaymentsService {
  private updatePayment(paymentId: string, orderId: string, status: number) {
    if (status === 1) {
      return Promise.all([
        Payment.update(
          { payment_status: PaymentStatus.Success, updated_at: new Date() },
          { where: { _id: paymentId } }
        ),
        Order.update({ status: OrderStatus.Paid, updated_at: new Date() }, { where: { _id: orderId } })
      ])
    } else {
      return Promise.all([
        Payment.update({ payment_status: PaymentStatus.Failed, updated_at: new Date() }, { where: { _id: paymentId } }),
        Order.update({ status: OrderStatus.Canceled, updated_at: new Date() }, { where: { _id: orderId } })
      ])
    }
  }

  async createPaymentUrl({ payload, ipAddr }: { payload: createPaymentUrlReqBody; ipAddr: string }) {
    try {
      const date = new Date()
      const createDate = moment(date).format('YYYYMMDDHHmmss')
      // const orderId = moment(date).format('DDHHmmss')
      const orderId = payload.oid
      const order = await ordersService.getOrder(orderId)
      const amount = order?.dataValues.total_price
      const bankCode = payload.bankCode
      let locale = payload.language

      const tmnCode = process.env.vnp_TmnCode
      const secretKey = process.env.vnp_HashSecret as string
      let vnpUrl = process.env.vnp_Url
      const returnUrl = process.env.vnp_ReturnUrl

      if (locale === null || locale === '') {
        locale = 'vn'
      }
      const paymentId = uuidv4()
      const currCode = 'VND'
      let vnp_Params: any = {}
      vnp_Params['vnp_Version'] = '2.1.0'
      vnp_Params['vnp_Command'] = 'pay'
      vnp_Params['vnp_TmnCode'] = tmnCode
      vnp_Params['vnp_Locale'] = locale
      vnp_Params['vnp_CurrCode'] = currCode
      vnp_Params['vnp_TxnRef'] = paymentId
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + paymentId
      vnp_Params['vnp_OrderType'] = 'other'
      vnp_Params['vnp_Amount'] = amount * 100
      vnp_Params['vnp_ReturnUrl'] = returnUrl
      vnp_Params['vnp_IpAddr'] = ipAddr
      vnp_Params['vnp_CreateDate'] = createDate
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode
      }

      await Payment.create({
        _id: paymentId,
        oid: orderId,
        payment_method: bankCode,
        total_price: amount,
        payment_date: date
      })

      vnp_Params = sortObject(vnp_Params)
      const signData = querystring.stringify(vnp_Params, { encode: false })
      const hmac = crypto.createHmac('sha512', secretKey)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
      vnp_Params['vnp_SecureHash'] = signed
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

      return vnpUrl
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async vnpayIpn(payload: querystring.ParsedQs) {
    let vnp_Params = payload
    const secureHash = vnp_Params['vnp_SecureHash']

    const paymentId = vnp_Params['vnp_TxnRef'] as string
    const amount = parseFloat(vnp_Params['vnp_Amount'] as string) / 100
    const rspCode = vnp_Params['vnp_ResponseCode'] as string

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)
    const secretKey = process.env.vnp_HashSecret as string
    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    // const payment = await Payment.findOne({ where: { _id: paymentId } })
    const payment = await Payment.findByPk(paymentId)

    const paymentStatus = payment?.dataValues.payment_status
    const orderId = payment?.dataValues.oid
    const checkPaymentId = payment != null
    const checkAmount = amount === payment?.dataValues.total_price
    if (secureHash === signed) {
      if (checkPaymentId) {
        if (checkAmount) {
          if (paymentStatus == PaymentStatus.Init) {
            if (rspCode == '00') {
              await this.updatePayment(paymentId, orderId, 1)
              return {
                message: 'success',
                RspCode: '00'
              }
            } else {
              await this.updatePayment(paymentId, orderId, 0)
              return {
                message: 'Failed',
                RspCode: rspCode
              }
            }
          } else {
            await this.updatePayment(paymentId, orderId, 0)
            return {
              message: 'This order has been updated to the payment status',
              RspCode: rspCode
            }
          }
        } else {
          await this.updatePayment(paymentId, orderId, 0)
          return {
            message: 'Amount invalid',
            RspCode: rspCode
          }
        }
      } else {
        await this.updatePayment(paymentId, orderId, 0)
        return {
          message: 'Order not found',
          RspCode: rspCode
        }
      }
    } else {
      await this.updatePayment(paymentId, orderId, 0)
      return {
        message: 'Checksum failed',
        RspCode: rspCode
      }
    }
  }
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

const paymentsService = new PaymentsService()
export default paymentsService
