import USERS_MESSAGES from '~/constants/messages'
import Ticket from '~/models/schemas/ticket.models'

class TicketsService {
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
      return new Error(USERS_MESSAGES.ERROR)
    }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
