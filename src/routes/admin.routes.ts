import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  createGroupTicketsController,
  deleteGroupTicketsController,
  getGroupTicketsController,
  updateGroupTicketsController
} from '~/controllers/groupTickets.controllers'
import { createGroupValidator, updateGroupValidator } from '~/middlewares/groupTickets.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateGroupReqBody } from '~/models/Requests/groupTicket.requests'
import { setRoleValidator, roleAdminValidator, roleSuperAdminValidator } from '~/middlewares/admin.middlewares'
import { getUsersController, setRoleController } from '~/controllers/admin.controllers'

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
  deleteGroupTicketsController,
  wrapRequestHandler(deleteGroupTicketsController)
)



export default adminRouter
