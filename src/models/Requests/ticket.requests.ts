export interface CreateTicketReqBody {
  code_ticket: string
  gid: number
  name: string
  price: number
  day_of_week: string
  short_description: string
  // description: string
  overview: string
  included_items: string
  meeting_point: string
  expectations: string
  additional_info: string
  cancellation_policy: string
  color: string
  card_type: string
  date_start: Date
  date_end: Date
}

export interface UpdateTicketReqBody {
  id: number
  code_ticket?: string
  gid?: number
  name?: string
  price?: number
  day_of_week?: string
  short_description?: string
  overview?: string
  included_items?: string
  meeting_point?: string
  expectations?: string
  additional_info?: string
  cancellation_policy?: string
  // description?: string
  color?: string
  card_type?: string
  date_start?: Date
  date_end?: Date
}