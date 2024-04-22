import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/others'

class MediasService {
  async handleUploadFileImage(req: Request) {
    try {
      const files = await handleUploadImage(req)
      const result: Media[] = await Promise.all(
        files.map(async (file) => {
          const newName = getNameFromFullName(file.newFilename)
          const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
          await sharp(file.filepath).jpeg().toFile(newPath)
          fs.unlinkSync(file.filepath)
          return {
            url: `http://localhost:${process.env.PORT}/api/v1/static/image/${newName}`,
            type: MediaType.Image
          }
        })
      )
      return result
    } catch (error) {
      throw new Error('error: ' + error)
    }
  }
}

const mediasService = new MediasService()

export default mediasService
