import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import crypto from 'crypto'
import { createPaymentUrlReqBody, querydrReqBody } from '~/models/Requests/payment.requests'
import ordersService from './orders.services'
import querystring from 'qs'
import Payment from '~/models/schemas/payment.models'
import { OrderStatus, PaymentStatus, ReviewsStatus } from '~/constants/enums'
import Order from '~/models/schemas/order.models'
import usersService from './users.services'
import OrderDetails from '~/models/schemas/orderDetails.models'
import Ticket from '~/models/schemas/ticket.models'
import { sendVerifyEmail } from '~/utils/email'

class PaymentsService {
  private updatePayment(paymentId: string, orderId: string, status: number) {
    if (status === 1) {
      return Promise.all([
        Payment.update(
          { payment_status: PaymentStatus.Success, updated_at: new Date() },
          { where: { _id: paymentId } }
        ),
        Order.update({ status: OrderStatus.Paid, updated_at: new Date() }, { where: { _id: orderId } }),
        OrderDetails.update(
          { reviews_status: ReviewsStatus.CanReview, updated_at: new Date() },
          { where: { oid: orderId } }
        )
      ])
    } else {
      return Promise.all([
        Payment.update({ payment_status: PaymentStatus.Failed, updated_at: new Date() }, { where: { _id: paymentId } }),
        Order.update({ status: OrderStatus.Canceled, updated_at: new Date() }, { where: { _id: orderId } })
      ])
    }
  }

  private formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  private async sendMail(userId: string, orderId: string) {
    console.log('hehehehe', userId)
    const [user, order, orderDetails] = await Promise.all([
      usersService.findOneUser(userId),
      Order.findByPk(orderId),
      OrderDetails.findAll({
        where: { oid: orderId },
        include: [{ model: Ticket, as: 'tickets' }]
      })
    ])

    let orderItemsHtml = ''
    for (const detail of orderDetails) {
      const ticket = detail.dataValues.tickets
      orderItemsHtml += `
        <p>${ticket.dataValues.name}</p>
        <p>${this.formatPrice(detail.dataValues.price)} x ${detail.dataValues.quantity}</p>
        <p>${this.formatPrice(detail.dataValues.price * detail.dataValues.quantity)}</p>
      `
    }
    await sendVerifyEmail(
      user?.dataValues.email,
      `Xác nhân đơn hàng ${orderId} từ ${process.env.WEB_NAME}`,
      `<p>Xin chào ${user?.dataValues.name}</p>
      <p>Cảm ơn Anh/chị đã mua vé tại <b>${process.env.WEB_NAME}!</b></p>
      <h2>Thông tin mua hàng</h2>
      <p>${user?.dataValues.name}</p>
      <p>${user?.dataValues.email}</p>
      <h2>Thông tin đơn hàng</h2>
      <p>Mã đơn hàng: ${orderId}</p>
      <p>Ngày đặt hàng: ${moment(order?.dataValues.date_order).format('DD/MM/YYYY')}</p>
      ${orderItemsHtml}
      <p>Thành tiền: ${this.formatPrice(order?.dataValues.total_price)}</p>
      <p class="text-align: right">Trân trọng,</p>
      <p class="text-align: right"><b>Ban quản trị ${process.env.WEB_NAME}</b></p>
      `
    )
  }

  async createPaymentUrl({
    payload,
    user_id,
    ipAddr
  }: {
    payload: createPaymentUrlReqBody
    user_id: string
    ipAddr: string
  }) {
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
      vnp_Params['vnp_OrderInfo'] = user_id
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
    const user_id = vnp_Params['vnp_OrderInfo'] as string
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
              await Promise.all([this.updatePayment(paymentId, orderId, 1), this.sendMail(user_id, orderId)])
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

  async querydr({ payload, vnp_IpAddr }: { payload: querydrReqBody; vnp_IpAddr: string }) {
    process.env.TZ = 'Asia/Ho_Chi_Minh'
    const date = new Date()

    const vnp_TmnCode = process.env.vnp_TmnCode
    const secretKey = process.env.vnp_HashSecret as string
    const vnp_Api = process.env.vnp_Api as string

    const vnp_TxnRef = payload.paymentId
    const vnp_TransactionDate = payload.transDate

    const vnp_RequestId = moment(date).format('HHmmss')
    const vnp_Version = '2.1.0'
    const vnp_Command = 'querydr'
    const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef

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
          return {
            data: data
          }
        })
        .catch((error) => {
          throw new Error('Error: ' + error)
        })
    })
  }

  async getAllPayments() {
    try {
      const payment = await Payment.findAll()
      return {
        data: payment
      }
    } catch (error) {
      return {
        error: error
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
