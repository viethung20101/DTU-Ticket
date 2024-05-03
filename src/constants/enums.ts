export enum RoleType {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User'
}

export enum UserVerifyStatus {
  Unverified = 'Unverified',
  Verified = 'Verified',
  Banned = 'Banned'
}

export enum TokenType {
  AccessToken = 'AccessToken',
  RefreshToken = 'RefreshToken',
  ForgotPasswordToken = 'ForgotPasswordToken',
  EmailVerifyToken = 'EmailVerifyToken'
}

export enum ActivatedStatus {
  Activated = 'Activated',
  NotActivated = 'NotActivated'
}

export enum ShownStatus {
  Shown = 'Shown',
  NotShown = 'NotShown'
}

export enum MediaType {
  Image = 'Image',
  Video = 'Video'
}

export enum OrderStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
  Canceled = 'Canceled'
}

export enum PaymentMethod {
  VNBANK = 'VNBANK',
  VNPAYQR = 'VNPAYQR',
  INTCARD = 'INTCARD'
}

export enum PaymentStatus {
  Init = 'Init',
  Success = 'Success',
  Failed = 'Failed'
}

export enum TicketUsageStatus {
  Used = 'Used',
  Unused = 'Unused',
  Expired = 'Expired'
}
