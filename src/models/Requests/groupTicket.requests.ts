export interface CreateGroupReqBody {
  name: string
  short_description: string
  description: string
  date_start: Date
  date_end: Date
}

export interface UpdateGroupReqBody {
  id: number
  name?: string
  short_description?: string
  description?: string
  date_start?: Date
  date_end?: Date
}
