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
import User from '~/models/schemas/user.models'

class MediasService {
  async handleUploadFileImage({ req, uploadDir, maxFiles }: { req: Request; uploadDir: string; maxFiles: number }) {
    try {
      const files = await handleUploadImage({ req: req, maxFiles: maxFiles })
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
      const result = await this.handleUploadFileImage({ req: req, uploadDir: UPLOAD_TICKET_DIR, maxFiles: 10 })
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

  async uploadAvatar({ user_id, req }: { user_id: string; req: Request }) {
    try {
      const media = await this.handleUploadFileImage({ req: req, uploadDir: UPLOAD_TICKET_DIR, maxFiles: 1 })
      const result = await User.update({ url: media[0].url, updated_at: new Date() }, { where: { _id: user_id } })

      return {
        result: media[0].url
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error: ' + error)
    }
  }
}

const mediasService = new MediasService()

export default mediasService
