/** Paths from docs/api-be.json. Joined onto NEXT_PUBLIC_API_BASE_URL. */
export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    VERIFY_OTP: "/api/v1/auth/verify-otp",
    RESEND_OTP: "/api/v1/auth/resend-otp",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    FORGOT_PASSWORD_VERIFY_OTP: "/api/v1/auth/forgot-password/verify-otp",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    REFRESH: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
  },
  ACCOUNT: {
    ME: "/api/v1/account/me",
    CHANGE_PASSWORD: "/api/v1/account/change-password",
  },
  USER: {
    LIST: "/api/v1/users",
    DETAIL: (id: number) => `/api/v1/users/${id}`,
    STATUS: (id: number) => `/api/v1/users/${id}/status`,
  },
  ROLE: {
    LIST: "/api/v1/roles",
    DETAIL: (id: number) => `/api/v1/roles/${id}`,
  },
  PERMISSION: {
    TREE: "/api/v1/permissions/tree",
  },
} as const
