import { apiClient } from "@/lib/api-client"
import { API_ENDPOINT } from "@/shared/constants"
import type { AccountResponse } from "@/shared/interfaces"

export const accountService = {
  /** UC003. The signed-in account's own profile. */
  me: () => apiClient<AccountResponse>(API_ENDPOINT.ACCOUNT.ME),

  update: (payload: { fullName: string; email: string; phone: string }) =>
    apiClient<void>(API_ENDPOINT.ACCOUNT.ME, {
      method: "PUT",
      body: JSON.stringify(payload),
      successToast: "Cập nhật thành công",
    }),

  /** UC075. */
  changePassword: (payload: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) =>
    apiClient<void>(API_ENDPOINT.ACCOUNT.CHANGE_PASSWORD, {
      method: "POST",
      body: JSON.stringify(payload),
      successToast: "Đổi mật khẩu thành công",
    }),
}
