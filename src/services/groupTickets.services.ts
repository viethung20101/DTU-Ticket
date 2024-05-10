import { v4 as uuidv4 } from 'uuid'
import { ShownStatus } from '~/constants/enums'
import { CreateGroupReqBody, UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import GroupTicket from '~/models/schemas/groupTicket.models'

class GroupTicketsService {
  async checkGroupExist(_id: string) {
    const group = await GroupTicket.findByPk(_id)
    return group
  }

  async getAllGroup() {
    try {
      const groupTickets = await GroupTicket.findAll({
        order: [['_id', 'ASC']]
      })
      return {
        data: groupTickets
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async getGroup() {
    try {
      const groupTickets = await GroupTicket.findAll({
        order: [['_id', 'ASC']],
        where: {
          shown: ShownStatus.Shown
        }
      })
      return {
        data: groupTickets
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async createGroup(payload: CreateGroupReqBody) {
    try {
      const group_id = uuidv4()
      await GroupTicket.create({
        _id: group_id,
        ...payload,
        date_start: new Date(payload.date_start),
        date_end: new Date(payload.date_end)
      })
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async updateGroup(payload: UpdateGroupReqBody) {
    const { id: payloadId, ..._payload } = payload
    _payload.date_start = payload.date_start ? new Date(payload.date_start) : _payload.date_start
    _payload.date_end = payload.date_end ? new Date(payload.date_end) : _payload.date_end
    try {
      await GroupTicket.update({ ..._payload, updated_at: new Date() }, { where: { _id: payloadId } })
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }

  async deleteGroup(id: string) {
    try {
      await GroupTicket.destroy({ where: { _id: id } })
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }
}

const groupTicketsService = new GroupTicketsService()
export default groupTicketsService
