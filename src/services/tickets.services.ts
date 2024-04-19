import { v4 as uuidv4 } from 'uuid'
import { CreateTicketReqBody, UpdateTicketReqBody } from '~/models/Requests/ticket.requests'
import GroupTicket from '~/models/schemas/groupTicket.models'
import Ticket from '~/models/schemas/ticket.models'

class TicketsService {
  async checkTicketExist(_id: string) {
    const ticket = await Ticket.findByPk(_id)
    return ticket
  }

  async getTickets({ page, size }: { page: number; size: number }) {
    try {
      if (!page) {
        page = 1
      }
      if (!size) {
        size = 10
      }
      const limit = size
      const offset = (page - 1) * size
      const ticket = await Ticket.findAll({
        attributes: ['id', 'name', 'price', 'day_of_week', 'short_description'],
        include: [
          {
            model: GroupTicket,
            attributes: ['name'],
            as: 'group_tickets',
            where: {
              shown: 'Shown'
            }
          }
        ],
        where: {
          shown: 'Shown'
        },
        limit,
        offset
      })
      const total_documents = await Ticket.count()
      const previous_pages = page - 1
      const next_pages = Math.ceil((total_documents - offset) / size)
      return {
        page: page,
        size: size,
        data: ticket,
        previous: previous_pages,
        next: next_pages
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async getTicketDetails(id: string) {
    try {
      const ticket = await Ticket.findOne({
        include: [
          {
            model: GroupTicket,
            attributes: ['name'],
            as: 'group_tickets',
            where: {
              shown: 'Shown'
            }
          }
        ],
        where: {
          shown: 'Shown'
        }
      })
      return {
        data: ticket
      }
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async getAllTickets() {
    try {
      const ticket = await Ticket.findAll({
        include: [
          {
            model: GroupTicket,
            as: 'group_tickets',
            attributes: ['name']
          }
        ]
      })
      return {
        data: ticket
      }
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async createTicket(payload: CreateTicketReqBody) {
    try {
      const ticket_id = uuidv4()
      await Ticket.create({
        _id: ticket_id,
        ...payload,
        date_start: new Date(payload.date_start),
        date_end: new Date(payload.date_end)
      })
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async updateTicket(payload: UpdateTicketReqBody) {
    const { id: payloadId, ..._payload } = payload
    _payload.date_start = payload.date_start ? new Date(payload.date_start) : _payload.date_start
    _payload.date_end = payload.date_end ? new Date(payload.date_end) : _payload.date_end
    try {
      await Ticket.update({ ..._payload, updated_at: new Date() }, { where: { _id: payloadId } })
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async deleteTicket(id: string) {
    try {
      await Ticket.destroy({ where: { _id: id } })
    } catch (error) {
      return {
        error: error
      }
    }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
