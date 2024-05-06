import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  secure: false,
  port: 2525,
  service: 'Gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddress,
  ccAddress = [],
  subject,
  text = '',
  html,
  replyToAddress = []
}: {
  fromAddress: string
  toAddress: string | string[]
  ccAddress?: string | string[]
  subject: string
  text?: string
  html: string
  replyToAddress?: string | string[]
}) => {
  return transporter.sendMail({
    from: fromAddress,
    to: Array.isArray(toAddress) ? toAddress : [toAddress],
    cc: Array.isArray(ccAddress) ? ccAddress : [ccAddress],
    subject: subject,
    text: text,
    html: html,
    headers: { 'x-myheader': 'test header' },
    replyTo: Array.isArray(replyToAddress) ? replyToAddress : [replyToAddress]
  })
}

export const sendVerifyEmail = (toAddress: string, subject: string, html: string) => {
  try {
    const sendEmailCommand = createSendEmailCommand({
      fromAddress: process.env.USER_MAIL as string,
      toAddress: toAddress,
      subject: subject,
      html: html
    })
    return sendEmailCommand
  } catch (error) {
    console.log(error)
    throw new Error('Error: ' + error)
  }
}
