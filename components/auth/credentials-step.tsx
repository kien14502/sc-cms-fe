"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { readRememberedUsername } from "@/hooks/useLoginFlow"
import { loginSchema, type LoginFormValues } from "@/shared/schemas"

import { AuthCard } from "./auth-card"
import { PasswordField } from "./password-field"

/** SCR-1 of UC001. */
export function CredentialsStep({
  isSubmitting,
  onSubmit,
  onForgotPassword,
}: {
  isSubmitting: boolean
  onSubmit: (values: LoginFormValues) => void
  onForgotPassword: () => void
}) {
  const rememberedUsername = readRememberedUsername()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: rememberedUsername,
      password: "",
      remember: Boolean(rememberedUsername),
    },
  })

  return (
    <AuthCard
      title="Đăng nhập"
      description="Nhập tài khoản quản trị để tiếp tục vào HomeHub CMS."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field data-invalid={Boolean(errors.username)}>
          <FieldLabel htmlFor="login-username">
            Tên đăng nhập <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="login-username"
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

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="login-password">
            Mật khẩu <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            maxLength={50}
            placeholder="Nhập mật khẩu"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <div className="flex items-center justify-between gap-3">
          <Field orientation="horizontal" className="w-auto">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldLabel htmlFor="login-remember" className="font-normal">
              Ghi nhớ đăng nhập
            </FieldLabel>
          </Field>

          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0"
            onClick={onForgotPassword}
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang kiểm tra..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthCard>
  )
}
