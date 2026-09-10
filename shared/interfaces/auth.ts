import type { PermissionAction, PermissionResource } from "@/shared/constants"

import type { ApiStatus } from "./api"

/** One cell of the resource x action matrix the RBAC model is built on. */
export type Permission = {
  resource: PermissionResource
  action: PermissionAction
}

/** GET /api/v1/account/me */
export type AccountResponse = {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  department: string
  status: ApiStatus
  roleName: string
}

/** The signed-in account as the console reads it. */
export type AuthUser = AccountResponse & {
  permissions: Permission[]
}

/** Tokens minted by verify-otp and refresh. */
export type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  passwordExpired: boolean
}

/** Step one of the two-layer login, and the forgot-password branch. */
export type LoginResponse = {
  otpToken: string
  maskedEmail: string
  expiresInSeconds: number
}

/** What a valid OTP on the forgot-password branch returns. */
export type ResetTokenResponse = {
  resetToken: string
}

/** Which card the login route is showing. */
export type LoginStep = "credentials" | "forgot" | "otp" | "reset"

/** Which branch sent the user to the OTP card. */
export type OtpPurpose = "login" | "reset"
