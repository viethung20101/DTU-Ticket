import USERS_MESSAGES from '~/constants/messages'
import GroupTicket from '~/models/schemas/groupTicket.models'
import Ticket from '~/models/schemas/ticket.models'
import TicketDetails from '~/models/schemas/ticketDetails.models'

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
        attributes: ['id', 'name'],
        include: [
          {
            model: GroupTicket,
            attributes: ['name'],
            where: { shown: true }
          },
          {
            model: TicketDetails,
            attributes: ['price', 'day_of_week', 'short_description']
          }
        ],
        where: {
          shown: true
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
      return new Error(USERS_MESSAGES.ERROR)
    }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
