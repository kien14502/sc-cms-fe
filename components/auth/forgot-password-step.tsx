"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/shared/schemas"

import { AuthCard } from "./auth-card"

/** SCR-2 of UC001. */
export function ForgotPasswordStep({
  isSubmitting,
  onSubmit,
  onBack,
}: {
  isSubmitting: boolean
  onSubmit: (values: ForgotPasswordFormValues) => void
  onBack: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { username: "" },
  })

  return (
    <AuthCard
      title="Quên mật khẩu"
      description="Nhập tên đăng nhập, hệ thống sẽ gửi mã OTP tới email của tài khoản."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field data-invalid={Boolean(errors.username)}>
          <FieldLabel htmlFor="forgot-username">
            Tên đăng nhập <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="forgot-username"
            autoFocus
            autoComplete="username"
            maxLength={50}
            placeholder="Nhập tên đăng nhập"
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
          {errors.username && (
            <FieldError>{errors.username.message}</FieldError>
          )}
        </Field>

        <div className="space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi OTP qua email"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}
