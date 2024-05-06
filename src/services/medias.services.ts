import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR, UPLOAD_TICKET_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { MediaType } from '~/constants/enums'
import { MediaInterface } from '~/models/others'
import Media from '~/models/schemas/media.models'
import { v4 as uuidv4 } from 'uuid'

class MediasService {
  async handleUploadFileImage({ req, uploadDir }: { req: Request; uploadDir: string }) {
    try {
      const files = await handleUploadImage(req)
      const result: MediaInterface[] = await Promise.all(
        files.map(async (file) => {
          const newName = getNameFromFullName(file.newFilename)
          const newPath = path.resolve(uploadDir, `${newName}.jpg`)
          await sharp(file.filepath).jpeg().toFile(newPath)
          fs.unlinkSync(file.filepath)
          if (uploadDir === UPLOAD_DIR) {
            return {
              url: `http://localhost:${process.env.PORT}/api/v1/static/image/${newName}`,
              type: MediaType.Image
            }
          } else {
            const dir = uploadDir.split('uploads/')[1]
            return {
              url: `http://localhost:${process.env.PORT}/api/v1/static/image/${dir}/${newName}`,
              type: MediaType.Image
            }
          }
        })
      )
      return result
    } catch (error) {
      throw new Error('error: ' + error)
    }
  }

  async uploadTicketImage({ tid, req }: { tid: string; req: Request }) {
    try {
      const result = await this.handleUploadFileImage({ req: req, uploadDir: UPLOAD_TICKET_DIR })
      const mediaObjects = result.map((mediaData: any) => ({
        _id: uuidv4(),
        tid: tid,
        url: mediaData.url,
        type: mediaData.type
      }))

      const createdMedias = await Media.bulkCreate(mediaObjects)
      return {
        result: createdMedias
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error: ' + error)
    }
  }
}

const mediasService = new MediasService()

export default mediasService
