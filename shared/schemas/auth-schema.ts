import { z } from "zod"

import { OTP_LENGTH } from "@/shared/constants"

/** SCR-1 and SCR-2 share the same username rules. */
const username = z
  .string()
  .trim()
  .min(1, "Tên đăng nhập không được để trống")
  .max(50, "Tên đăng nhập tối đa 50 ký tự")
  .regex(/^[a-zA-Z0-9._-]+$/, "Tên đăng nhập chứa ký tự không hợp lệ")

export const loginSchema = z.object({
  username,
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .max(50, "Mật khẩu tối đa 50 ký tự"),
  remember: z.boolean(),
})

export const forgotPasswordSchema = z.object({ username })

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP không được để trống!")
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `OTP gồm ${OTP_LENGTH} chữ số`),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Mật khẩu mới không được để trống!")
    .max(100, "Mật khẩu mới tối đa 100 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Mật khẩu tối thiểu 8 ký tự, phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!"
    ),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type OtpFormValues = z.infer<typeof otpSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
