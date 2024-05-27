export interface CreateTicketReqBody {
  code_ticket?: string
  gid: string
  name: string
  price: number
  day_of_week?: string
  short_description: string
  default_daily_quota: number
  // description: string
  overview?: string
  included_items?: string
  meeting_point?: string
  expectations?: string
  additional_info?: string
  cancellation_policy?: string
  color?: string
  card_type: string
  date_start?: Date
  date_end?: Date
}

export interface UpdateTicketReqBody {
  id: string
  code_ticket?: string
  gid?: string
  name?: string
  price?: number
  day_of_week?: string
  default_daily_quota?: number
  daily_quota?: number
  last_reset_date?: Date
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
