import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  createGroupTicketsController,
  deleteGroupTicketsController,
  getGroupTicketsController,
  updateGroupTicketsController
} from '~/controllers/groupTickets.controllers'
import {
  createGroupValidator,
  deleteGroupValidator,
  updateGroupValidator
} from '~/middlewares/groupTickets.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import { setRoleValidator, roleAdminValidator, roleSuperAdminValidator } from '~/middlewares/admin.middlewares'
import { getUsersController, setRoleController } from '~/controllers/admin.controllers'
import {
  createTicketsController,
  deleteTicketController,
  getAllTicketsController,
  updateTicketController
} from '~/controllers/tickets.controllers'
import { createTicketValidator, deleteTicketValidator, updateTicketValidator } from '~/middlewares/tickets.middlewares'
import { UpdateTicketReqBody } from '~/models/Requests/ticket.requests'

const adminRouter = Router()

adminRouter.get('/users/data', roleSuperAdminValidator, wrapRequestHandler(getUsersController))

adminRouter.post('/users/set-role', roleSuperAdminValidator, setRoleValidator, wrapRequestHandler(setRoleController))

adminRouter.get('/group-tickets/data', roleAdminValidator, wrapRequestHandler(getGroupTicketsController))

adminRouter.post(
  '/group-tickets/create',
  roleAdminValidator,
  createGroupValidator,
  wrapRequestHandler(createGroupTicketsController)
)

adminRouter.patch(
  '/group-tickets/update',
  roleAdminValidator,
  updateGroupValidator,
  filterMiddleware<UpdateGroupReqBody>(['id', 'name', 'short_description', 'description', 'date_start', 'date_end']),
  wrapRequestHandler(updateGroupTicketsController)
)

adminRouter.post(
  '/group-tickets/delete',
  roleAdminValidator,
  deleteGroupValidator,
  wrapRequestHandler(deleteGroupTicketsController)
)

adminRouter.get('/tickets/data', roleAdminValidator, wrapRequestHandler(getAllTicketsController))

adminRouter.post(
  '/tickets/create',
  roleAdminValidator,
  createTicketValidator,
  wrapRequestHandler(createTicketsController)
)

adminRouter.patch(
  '/tickets/update',
  roleAdminValidator,
  updateTicketValidator,
  filterMiddleware<UpdateTicketReqBody>([
    'id',
    'code_ticket',
    'gid',
    'name',
    'price',
    'day_of_week',
    'default_daily_quota',
    'short_description',
    'overview',
    'included_items',
    'meeting_point',
    'expectations',
    'additional_info',
    'cancellation_policy',
    // 'description',
    'color',
    'card_type',
    'date_start',
    'date_end'
  ]),
  wrapRequestHandler(updateTicketController)
)

adminRouter.post(
  '/tickets/delete',
  roleAdminValidator,
  deleteTicketValidator,
  wrapRequestHandler(deleteTicketController)
)

export default adminRouter
