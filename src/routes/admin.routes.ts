import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  changeStatusGroupController,
  createGroupTicketsController,
  deleteGroupTicketsController,
  getAllGroupTicketsController,
  updateGroupTicketsController
} from '~/controllers/groupTickets.controllers'
import {
  changeStatusGroupValidator,
  createGroupValidator,
  deleteGroupValidator,
  updateGroupValidator
} from '~/middlewares/groupTickets.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import {
  setRoleValidator,
  roleAdminValidator,
  roleSuperAdminValidator,
  banAllUsersValidator,
  banUsersValidator
} from '~/middlewares/admin.middlewares'
import {
  banAllUsersController,
  banUsersController,
  getAdminController,
  getAllUsersController,
  getUsersController,
  setRoleController
} from '~/controllers/admin.controllers'
import {
  changeStatusTicketController,
  createTicketsController,
  deleteTicketController,
  getAllTicketsController,
  updateTicketController
} from '~/controllers/tickets.controllers'
import {
  changeStatusTicketValidator,
  createTicketValidator,
  deleteTicketValidator,
  updateTicketValidator
} from '~/middlewares/tickets.middlewares'
import { UpdateTicketReqBody } from '~/models/Requests/ticket.requests'
import { getAllPaymentsController } from '~/controllers/payments.controllers'
import { uploadTicketImageController } from '~/controllers/medias.controllers'
import { getAllReviewsController } from '~/controllers/reviews.controllers'

const adminRouter = Router()

adminRouter.get('/all-users/data', roleSuperAdminValidator, wrapRequestHandler(getAllUsersController))

adminRouter.get('/all-users/admin/data', roleSuperAdminValidator, wrapRequestHandler(getAdminController))

adminRouter.get('/users/data', roleAdminValidator, wrapRequestHandler(getUsersController))

adminRouter.post(
  '/all-users/set-role',
  roleSuperAdminValidator,
  setRoleValidator,
  wrapRequestHandler(setRoleController)
)

adminRouter.post(
  '/all-users/ban/:id',
  roleSuperAdminValidator,
  banAllUsersValidator,
  wrapRequestHandler(banAllUsersController)
)

adminRouter.post('/users/ban/:id', roleAdminValidator, banUsersValidator, wrapRequestHandler(banUsersController))

adminRouter.get('/group-tickets/data', roleAdminValidator, wrapRequestHandler(getAllGroupTicketsController))

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
  '/group-tickets/change-status/:id',
  roleAdminValidator,
  changeStatusGroupValidator,
  wrapRequestHandler(changeStatusGroupController)
)

adminRouter.post(
  '/group-tickets/delete/:id',
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

adminRouter.post('/tickets/upload-image/:tid', wrapRequestHandler(uploadTicketImageController))

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
  '/tickets/delete/:id',
  roleAdminValidator,
  deleteTicketValidator,
  wrapRequestHandler(deleteTicketController)
)

adminRouter.post(
  '/tickets/change-status/:id',
  roleAdminValidator,
  changeStatusTicketValidator,
  wrapRequestHandler(changeStatusTicketController)
)

adminRouter.get('/payments/data', roleAdminValidator, wrapRequestHandler(getAllPaymentsController))

adminRouter.get('/reviews/data', roleAdminValidator, wrapRequestHandler(getAllReviewsController))

export default adminRouter
