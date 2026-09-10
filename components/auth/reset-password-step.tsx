"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/shared/schemas"

import { AuthCard } from "./auth-card"
import { PasswordField } from "./password-field"

/** SCR-4 of UC001. The username is shown but cannot be edited. */
export function ResetPasswordStep({
  isSubmitting,
  username,
  onSubmit,
}: {
  isSubmitting: boolean
  username: string
  onSubmit: (values: ResetPasswordFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  return (
    <AuthCard
      title="Đổi mật khẩu"
      description="Đặt mật khẩu mới cho tài khoản vừa xác thực."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <FieldLabel htmlFor="reset-username">Tên đăng nhập</FieldLabel>
          <Input id="reset-username" value={username} readOnly disabled />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="reset-password">
            Mật khẩu mới <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordField
            id="reset-password"
            autoFocus
            autoComplete="new-password"
            maxLength={100}
            placeholder="Nhập mật khẩu mới"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <FieldDescription>
            Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </FieldDescription>
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </form>
    </AuthCard>
  )
}
