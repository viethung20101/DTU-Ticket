import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { UPLOAD_DIR, UPLOAD_TICKET_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/Requests/user.requests'
import mediasService from '~/services/medias.services'
import ticketsService from '~/services/tickets.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadFileImage({ req: req, uploadDir: UPLOAD_DIR, maxFiles: 10 })
  return res.json({
    result: result
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_DIR, name + '.jpg'), (err) => {
    if (err) {
      res.status((err as any).status).send('File not found')
    }
  })
}

export const serveTicketImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_TICKET_DIR, name + '.jpg'), (err) => {
    if (err) {
      res.status((err as any).status).send('File not found')
    }
  })
}

export const uploadTicketImageController = async (req: Request, res: Response, next: NextFunction) => {
  const tid = req.params.tid
  const ticket = await ticketsService.checkTicketExist(tid)
  if (ticket === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.TICKET_NOT_FOUND
    })
  }
  const result = await mediasService.uploadTicketImage({ tid: tid, req: req })
  return res.json({
    message: 'Upload images success',
    result: result
  })
}

export const uploadAvatarController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await mediasService.uploadAvatar({ user_id: user_id, req: req })
  return res.json({
    message: 'Upload avatar success',
    result: result
  })
}
