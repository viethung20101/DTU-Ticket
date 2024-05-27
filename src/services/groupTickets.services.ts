import { v4 as uuidv4 } from 'uuid'
import { ShownStatus } from '~/constants/enums'
import { CreateGroupReqBody, UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import GroupTicket from '~/models/schemas/groupTicket.models'
import { ParsedQs } from 'qs'

class GroupTicketsService {
  async checkGroupExist(_id: string) {
    const group = await GroupTicket.findByPk(_id)
    return group
  }

  async getAllGroup(payload: ParsedQs) {
    try {
      let page = parseInt(payload.page as string)
      let size = parseInt(payload.size as string)
      if (!page) {
        page = 1
      }
      if (!size) {
        size = 10
      }
      const offset = (page - 1) * size
      const groupTickets = await GroupTicket.findAll()
      const paginatedTickets = groupTickets.slice(offset, offset + size)
      const total_documents = groupTickets.length
      const previous_pages = page > 1 ? page - 1 : null
      const totalPages = Math.ceil((total_documents - offset) / size)
      const next_pages = page < totalPages ? page + 1 : null
      return {
        page: page,
        size: size,
        total: total_documents,
        data: paginatedTickets,
        previous: previous_pages,
        next: next_pages
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
    payload.date_start = payload.date_start ? new Date(payload.date_start) : payload.date_start
    payload.date_end = payload.date_end ? new Date(payload.date_end) : payload.date_end
    try {
      const group_id = uuidv4()
      await GroupTicket.create({
        _id: group_id,
        ...payload
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

  async changeStatusGroup({ id, shown }: { id: string; shown: ShownStatus }) {
    try {
      await GroupTicket.update({ shown: shown, updated_at: new Date() }, { where: { _id: id } })
      const groupTicket = await GroupTicket.findByPk(id)
      return {
        data: groupTicket
      }
    } catch (error) {
      throw new Error('Error: ' + error)
    }
  }
}

const groupTicketsService = new GroupTicketsService()
export default groupTicketsService
