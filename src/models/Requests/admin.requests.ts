import { RoleType } from '~/constants/enums'

export interface SetRoleReqBody {
  id: string
  role: RoleType
}
