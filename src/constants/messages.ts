export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXIST: 'Email already exist',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_30: 'Password length must be from 6 to 30',
  PASSWORD_IS_TOO_WEEK: 'Password is too weak',
  CONFIRM_PASSWORD_NOT_MATCH_PASSWORD: 'Confirm password not match password',
  INCORRECT_DATE_FORMAT: 'Incorrect date format',
  LOGIN_SUCCESS: 'Login successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  REGISTER_SUCCESS: 'Register success',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  ACCESS_TOKEN_IS_RIQUIRED: 'Access token is required',
  ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token must be a string',
  WRONG_ACCESS_TOKEN: 'Wrong access token',
  REFRESH_TOKEN_IS_RIQUIRED: 'Access token is required',
  REFRESH_TOKEN_MUST_BE_A_STRING: 'Access token must be a string',
  WRONG_REFRESH_TOKEN: 'Wrong refresh token',
  ERROR: 'ERROR',
  CHECK_EMAIL_TO_CHANGE_PASSWORD: 'Check email to change password',
  FORGOT_PASSWORD_TOKEN_IS_RIQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_MUST_BE_A_STRING: 'Forgot password token must be a string',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'verify forgot password success',
  RESET_PASSWORD_SUCCESS: 'Reset passowrd success',
  GET_ME_SUCCESS: 'Get me success',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  GET_ALL_TICKETS_SUCCESS: 'Get all tickets success',
  ROLE_IS_NOT_ADMIN: 'Role is not admin',
  ROLE_IS_NOT_SUPER_ADMIN: 'Role is not super admin',
  NAME_OF_GROUP_TICKET_IS_REQUIRED: 'Name of group ticket is required',
  NAME_OF_GROUP_TICKET_MUST_BE_A_STRING: 'Name of group ticket must be a string',
  SHORT_DESCRIPTION_IS_REQUIRED: 'Short decription is required',
  SHORT_DESCRIPTION_MUST_BE_A_STRING: 'Short decription must be a string',
  DESCRIPTION_IS_REQUIRED: 'Decription is required',
  DESCRIPTION_MUST_BE_A_STRING: 'Decription must be a string',
  END_DATE_MUST_BE_GREATER_THAN_START_DATE: 'End date must be greater than start date',
  CREATE_GROUP_TICKET_SUCCESS: 'Create group ticket success',
  GROUP_ID_IS_REQUIRED: 'Group id is required',
  GROUP_NOT_FOUND: 'Group not found',
  GET_ALL_GROUP_TICKETS_SUCCESS: 'Get all group ticket success',
  GET_GROUP_TICKETS_SUCCESS: 'Get group ticket success',
  UPDATE_GROUP_TICKET_SUCCESS: 'Update group ticket success',
  OUT_PASSWORD_NOT_MATCH: 'Out password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  DELETE_GROUP_TICKET_SUCCESS: 'Delete group ticket success',
  USER_ID_IS_REQUIRED: 'User id is required',
  ROLE_IS_REQUIRED: 'Role is required',
  ROLE_NOT_FOUND: 'Role not found',
  SET_ROLE_SUCCESS: 'Set role success',
  CODE_TICKET_MUST_BE_A_STRING: 'Code ticket must be a string',
  NAME_OF_TICKET_IS_REQUIRED: 'Name of ticket is required',
  NAME_OF_TICKET_MUST_BE_A_STRING: 'Name of ticket must be a string',
  PRICE_IS_REQUIRED: 'Price is required',
  PRICE_IS_NOT_NUMERIC: 'Price is not number',
  DAY_OF_WEEK_IS_REQUIRED: 'Day of week is required',
  DAY_OF_WEEK_MUST_BE_A_STRING: 'Day of week must be a string',
  COLOR_MUST_BE_A_STRING: 'Color must be a string',
  CARD_TYPE_IS_REQUIRED: 'Card type is required',
  CARD_TYPE_MUST_BE_A_STRING: 'Card type must be a string',
  CREATE_TICKET_SUCCESS: 'Create ticket success',
  TICKET_ID_IS_REQUIRED: 'Ticket id is required',
  TICKET_NOT_FOUND: 'Ticket not found',
  UPDATE_TICKET_SUCCESS: 'Update ticket success',
  DELETE_TICKET_SUCCESS: 'Delete ticket success',
  ID_MUST_BE_A_STRING: ' Id must be a string',
  GET_TICKET_DETAILS_SUCCESS: 'Get ticket details success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_ALL_USERS_SUCCESS: 'Get all users success',
  DEFAULT_DAILY_QUOTA_IS_REQUIRED: 'Default daily quota is required',
  DEFAULT_DAILY_QUOTA_MUST_BE_A_NUMERIC: 'Default daily quota must be a numeric',
  QUANTITY_IS_REQUIRED: 'Quantity is required',
  QUANTITY_MUST_BE_A_NUMERIC: 'Quantity must be a numeric',
  ORDER_DETAILS_MUST_BE_AN_ARRAY: 'Order details must be an array',
  ORDER_DETAILS_ARE_REQUIRED: 'Order details are required',
  TICKET_NOT_INSUFFICIENT_QUANTITY: 'Ticket not insufficient quantity',
  TICKET_USE_DATE_IS_INVALID: 'Ticket use date is invalid',
  PRICE_INVALID: 'Price invalid',
  DEFAULT_DAILY_QUOTA_INVALID: 'Default daily quota invalid'
} as const

export const PAYMENTS_MESSAGES = {
  ORDER_ID_MUST_BE_A_STRING: 'Order id must be a string',
  ORDER_ID_IS_REQUIRED: 'Order id is required',
  ORDER_NOT_FOUND: 'Order not found',
  PAYMENT_METHOD_MUST_BE_A_STRING: 'Payment method must be a string',
  PAYMENT_METHOD_IS_REQUIRED: 'Payment method is required',
  PAYMENT_METHOD_IS_INVALID: 'Payment method is invalid',
  LANGUAGE_MUST_BE_A_STRING: 'Language must be a string',
  LANGUAGE_IS_REQUIRED: 'Language is required',
  LANGUAGE_IS_INVALID: 'Language is invalid',
  GET_ALL_PAYMENTS_SUCCESS: 'Get all payments success'
} as const

export const REVIEWS_MESSAGES = {
  RATING_MUST_BE_A_NUMERIC: 'Rating must be a numeric',
  RATING_IS_REQUIRED: 'Rating is required',
  RATING_MUST_BE_AN_INTEGER: 'Rating must be an integer',
  RATING_OUT_OF_RANGE: 'Rating out of range',
  CANNOT_REVIEW_THIS_TICKET: 'Cannot review this ticket'
} as const
