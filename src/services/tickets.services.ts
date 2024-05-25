import { v4 as uuidv4 } from 'uuid'
import { ShownStatus } from '~/constants/enums'
import { CreateTicketReqBody, UpdateTicketReqBody } from '~/models/Requests/ticket.requests'
import GroupTicket from '~/models/schemas/groupTicket.models'
import OrderDetails from '~/models/schemas/orderDetails.models'
import Ticket from '~/models/schemas/ticket.models'
import { Op, Sequelize } from 'sequelize'
import Media from '~/models/schemas/media.models'
import Review from '~/models/schemas/review.models'
import { ParsedQs } from 'qs'
import User from '~/models/schemas/user.models'

class TicketsService {
  async checkTicketExist(_id: string) {
    const ticket = await Ticket.findByPk(_id)
    return ticket
  }

  async getTickets(payload: ParsedQs) {
    try {
      let page = parseInt(payload.page as string)
      let size = parseInt(payload.size as string)
      const orderOption: [string, string][] = []
      const whereCondition: any = {
        shown: ShownStatus.Shown
      }
      const whereGroupTicketCondition: any = {
        shown: ShownStatus.Shown
      }

      if (payload.sort) {
        orderOption.push(['price', payload.sort === 'price_asc' ? 'ASC' : 'DESC'])
      }

      if (!page) {
        page = 1
      }
      if (!size) {
        size = 10
      }
      const limit = size
      const offset = (page - 1) * size

      if (payload.price) {
        whereCondition.price = parseFloat(payload.price as string)
      }

      if (payload.price) {
        whereCondition.price = parseFloat(payload.price as string)
      }

      if (payload.min_price) {
        whereCondition.price = {
          ...whereCondition.price,
          [Op.gte]: parseFloat(payload.min_price as string)
        }
      }

      if (payload.max_price) {
        whereCondition.price = {
          ...whereCondition.price,
          [Op.lte]: parseFloat(payload.max_price as string)
        }
      }

      if (payload.type) {
        whereGroupTicketCondition.name = payload.type
      }

      const tickets = await Ticket.findAll({
        attributes: ['_id', 'name', 'price', 'day_of_week', 'short_description'],
        include: [
          {
            model: GroupTicket,
            attributes: ['name'],
            as: 'group_tickets',
            where: whereGroupTicketCondition
          }
        ],
        where: whereCondition,
        order: orderOption.length > 0 ? orderOption : undefined
      })

      const paginatedTickets = tickets.slice(offset, offset + size)

      const ticketArray = await Promise.all(
        paginatedTickets.map(async (ticket) => {
          const [media, reviews] = await Promise.all([
            Media.findOne({
              attributes: ['_id', 'url', 'type'],
              where: {
                tid: ticket.dataValues._id
              }
            }),
            Review.findAll({
              attributes: ['_id', 'uid', 'rating', 'comment', 'date'],
              where: {
                tid: ticket.dataValues._id,
                shown: ShownStatus.Shown
              }
            })
          ])

          const totalReviews = reviews.length
          const ratings = reviews.map((review) => review.dataValues.rating)
          const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews

          return {
            id: ticket.dataValues._id,
            group_ticket: ticket.dataValues.group_tickets.dataValues.name,
            name: ticket.dataValues.name,
            price: ticket.dataValues.price,
            day_of_week: ticket.dataValues.day_of_week,
            short_description: ticket.dataValues.short_description,
            media: {
              id: media?.dataValues._id,
              url: media?.dataValues.url,
              type: media?.dataValues.type
            },
            average_rating: averageRating,
            total_reviews: totalReviews
          }
        })
      )
      const total_documents = tickets.length
      const previous_pages = page > 1 ? page - 1 : null
      const totalPages = Math.ceil((total_documents - offset) / size)
      const next_pages = page < totalPages ? page + 1 : null
      return {
        page: page,
        size: size,
        total: total_documents,
        data: ticketArray,
        previous: previous_pages,
        next: next_pages
      }
    } catch (error) {
      return new Error('Error: ' + error)
    }
  }

  async getTicketDetails(id: string) {
    try {
      const [ticket, medias, reviews] = await Promise.all([
        Ticket.findOne({
          include: [
            {
              model: GroupTicket,
              attributes: ['name'],
              as: 'group_tickets',
              where: {
                shown: ShownStatus.Shown
              }
            }
          ],
          where: {
            _id: id,
            shown: ShownStatus.Shown
          }
        }),
        Media.findAll({
          attributes: ['_id', 'url', 'type'],
          where: {
            tid: id
          }
        }),
        Review.findAll({
          attributes: ['_id', 'uid', 'rating', 'comment', 'date'],
          where: {
            tid: id,
            shown: ShownStatus.Shown
          }
        })
      ])
      const mediaArray = medias.map((media) => ({
        id: media.dataValues._id,
        url: media.dataValues.url,
        type: media.dataValues.type
      }))
      const reviewArray = await Promise.all(
        reviews.map(async (review) => {
          const user = await User.findOne({
            attributes: ['name'],
            where: {
              _id: review.dataValues.uid
            }
          })
          return {
            id: review.dataValues._id,
            name: user?.dataValues.name,
            rating: review.dataValues.rating,
            comment: review.dataValues.comment,
            date: review.dataValues.date
          }
        })
      )

      return {
        id: ticket?.dataValues._id,
        group_ticket: ticket?.dataValues.group_tickets.dataValues.name,
        code_ticket: ticket?.dataValues.code_ticket,
        gid: ticket?.dataValues.gid,
        name: ticket?.dataValues.name,
        price: ticket?.dataValues.price,
        day_of_week: ticket?.dataValues.day_of_week,
        default_daily_quota: ticket?.dataValues.default_daily_quota,
        daily_quota: ticket?.dataValues.daily_quota,
        last_reset_date: ticket?.dataValues.last_reset_date,
        short_description: ticket?.dataValues.short_description,
        overview: ticket?.dataValues.overview,
        included_items: ticket?.dataValues.included_items,
        meeting_point: ticket?.dataValues.meeting_point,
        expectations: ticket?.dataValues.expectations,
        additional_info: ticket?.dataValues.additional_info,
        cancellation_policy: ticket?.dataValues.cancellation_policy,
        color: ticket?.dataValues.color,
        card_type: ticket?.dataValues.card_type,
        date_start: ticket?.dataValues.date_start,
        date_end: ticket?.dataValues.date_end,
        media: mediaArray,
        review: reviewArray,
        created_at: ticket?.dataValues.created_at,
        updated_at: ticket?.dataValues.updated_at
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
        daily_quota: payload.default_daily_quota,
        last_reset_date: new Date(),
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
    const { id: payloadId, default_daily_quota, ..._payload } = payload
    _payload.date_start = payload.date_start ? new Date(payload.date_start) : _payload.date_start
    _payload.date_end = payload.date_end ? new Date(payload.date_end) : _payload.date_end
    try {
      let updateData = {
        ..._payload,
        updated_at: new Date()
      }
      if (default_daily_quota !== undefined && default_daily_quota !== null) {
        updateData = {
          ...updateData,
          daily_quota: default_daily_quota,
          last_reset_date: new Date()
        }
      }
      await Ticket.update(updateData, { where: { _id: payloadId } })
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

  async updateDailyQuota() {
    try {
      const today = new Date()
      const tickets = await Ticket.findAll()

      for (const ticket of tickets) {
        let totalQuantity: number
        const totalPurchased = await OrderDetails.findAll({
          attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity']],
          where: {
            tid: ticket.dataValues._id,
            usage_date: {
              [Op.eq]: today
            }
          }
        })

        if (totalPurchased.length > 0 && totalPurchased[0].getDataValue('total_quantity') !== null) {
          totalQuantity = Number(totalPurchased[0].getDataValue('total_quantity'))
        } else {
          totalQuantity = 0
        }

        const defaultDailyQuota = ticket.dataValues.default_daily_quota
        const lastResetDate = ticket.dataValues.last_reset_date || today
        const todayStart = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        const lastResetDateStart = Date.UTC(
          lastResetDate.getFullYear(),
          lastResetDate.getMonth(),
          lastResetDate.getDate()
        )

        if (todayStart > lastResetDateStart) {
          const daily_quota = defaultDailyQuota - totalQuantity
          await ticket.update(
            { daily_quota: daily_quota, last_reset_date: today, updated_at: new Date() },
            { where: { _id: ticket.dataValues._id } }
          )
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
