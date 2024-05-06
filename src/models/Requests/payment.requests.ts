export interface createPaymentUrlReqBody {
  oid: string
  bankCode: string
  language: string
}

export interface querydrReqBody {
  paymentId: string
  transDate: Date
}
