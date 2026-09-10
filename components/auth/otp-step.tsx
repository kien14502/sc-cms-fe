"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { OTP_LENGTH } from "@/shared/constants"
import type { OtpPurpose } from "@/shared/interfaces"
import { otpSchema, type OtpFormValues } from "@/shared/schemas"

import { AuthCard } from "./auth-card"

/** SCR-3 of UC001, shared by the login branch and the forgot-password branch. */
export function OtpStep({
  isSubmitting,
  maskedEmail,
  purpose,
  onSubmit,
  onResend,
  onBack,
}: {
  isSubmitting: boolean
  maskedEmail: string
  purpose: OtpPurpose
  onSubmit: (values: OtpFormValues) => Promise<boolean>
  onResend: () => void
  onBack: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const otpField = register("otp")

  return (
    <AuthCard
      title={purpose === "login" ? "Xác thực đăng nhập" : "Xác thực OTP"}
      description={`Mã xác thực OTP đã được gửi đến email ${maskedEmail}`}
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          // AF-2 of the spec clears the input whenever the code is rejected.
          if (!(await onSubmit(values))) reset({ otp: "" })
        })}
      >
        <Field data-invalid={Boolean(errors.otp)}>
          <FieldLabel htmlFor="otp-code">
            Nhập OTP <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="otp-code"
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            placeholder="Nhập mã gồm 6 chữ số"
            className="text-center font-mono text-lg tracking-[0.5em]"
            aria-invalid={Boolean(errors.otp)}
            {...otpField}
            onChange={(event) => {
              event.target.value = event.target.value
                .replace(/\D/g, "")
                .slice(0, OTP_LENGTH)
              return otpField.onChange(event)
            }}
          />
          {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
        </Field>

        <div className="space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onClick={onResend}
          >
            Gửi lại mã OTP
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
