import { apiClient } from "@/lib/api-client"
import { API_ENDPOINT } from "@/shared/constants"
import type {
  LoginResponse,
  ResetTokenResponse,
  TokenResponse,
} from "@/shared/interfaces"

/** No session exists yet on these calls, so no bearer and no refresh retry. */
const preAuth = { skipAuthRefresh: true, skipAuthHeader: true } as const

function post<T>(url: string, payload: unknown, preLogin = false) {
  return apiClient<T>(url, {
    method: "POST",
    body: JSON.stringify(payload),
    ...(preLogin ? preAuth : {}),
  })
}

export const authService = {
  /** UC001 BF-4. Checks the credentials and mails an OTP. */
  login: (payload: { username: string; password: string }) =>
    post<LoginResponse>(API_ENDPOINT.AUTH.LOGIN, payload, true),

  /** UC001 BF-6. A valid OTP mints the session tokens. */
  verifyOtp: (payload: { otpToken: string; otp: string }) =>
    post<TokenResponse>(API_ENDPOINT.AUTH.VERIFY_OTP, payload, true),

  resendOtp: (payload: { otpToken: string }) =>
    post<LoginResponse>(API_ENDPOINT.AUTH.RESEND_OTP, payload, true),

  /** UC001 AF-1-3. Mails an OTP for the forgot-password branch. */
  forgotPassword: (payload: { username: string }) =>
    post<LoginResponse>(API_ENDPOINT.AUTH.FORGOT_PASSWORD, payload, true),

  /** UC001 AF-1-5. A valid OTP returns the token that authorises the reset. */
  forgotPasswordVerifyOtp: (payload: { otpToken: string; otp: string }) =>
    post<ResetTokenResponse>(
      API_ENDPOINT.AUTH.FORGOT_PASSWORD_VERIFY_OTP,
      payload,
      true
    ),

  /** UC001 AF-1-7. */
  resetPassword: (payload: { resetToken: string; newPassword: string }) =>
    post<void>(API_ENDPOINT.AUTH.RESET_PASSWORD, payload, true),

  /** UC002. */
  logout: () =>
    apiClient<void>(API_ENDPOINT.AUTH.LOGOUT, {
      method: "POST",
      skipAuthRefresh: true,
      showErrorToast: false,
    }),
}
