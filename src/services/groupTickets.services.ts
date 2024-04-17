import USERS_MESSAGES from '~/constants/messages'
import { CreateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import GroupTicket from '~/models/schemas/groupTicket.models'

class GroupTicketsService {
  async getGroup() {
    try {
      const groupTicket = await GroupTicket.findAll()
      return {
        data: groupTicket
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async createGroup(payload: CreateGroupReqBody) {
    try {
      await GroupTicket.create({
        ...payload,
        date_start: new Date(payload.date_start),
        date_end: new Date(payload.date_end)
      })
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }
}

const groupTicketsService = new GroupTicketsService()
export default groupTicketsService
