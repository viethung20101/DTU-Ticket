import { Request, Response, NextFunction } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_TEMP_DIR, UPLOAD_TICKET_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true
    })
  }
  if (!fs.existsSync(UPLOAD_TICKET_DIR)) {
    fs.mkdirSync(UPLOAD_TICKET_DIR, {
      recursive: true
    })
  }
}

export const handleUploadImage = async ({ req, maxFiles }: { req: Request; maxFiles: number }) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    multiples: true,
    maxFiles: maxFiles,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 10,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name == 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return true
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (fullname: string) => {
  const nameArr = fullname.split('.')
  nameArr.pop()
  return nameArr.join('')
}
