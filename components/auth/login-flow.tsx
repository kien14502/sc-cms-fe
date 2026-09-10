"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthHydrated } from "@/hooks/useAuthHydrated"
import { useLoginFlow } from "@/hooks/useLoginFlow"
import { useAuthStore } from "@/stores/auth-store"

import { AuthSkeleton } from "./auth-skeleton"
import { CredentialsStep } from "./credentials-step"
import { ForgotPasswordStep } from "./forgot-password-step"
import { OtpStep } from "./otp-step"
import { ResetPasswordStep } from "./reset-password-step"

/** The four cards of UC001, driven from a single route. */
export function LoginFlow() {
  const router = useRouter()
  const hydrated = useAuthHydrated()
  const user = useAuthStore((state) => state.user)
  const flow = useLoginFlow()

  // Logging in again on top of an open session would only confuse things.
  useEffect(() => {
    if (hydrated && user) router.replace("/")
  }, [hydrated, user, router])

  if (!hydrated) return <AuthSkeleton />

  switch (flow.step) {
    case "forgot":
      return (
        <ForgotPasswordStep
          isSubmitting={flow.isSubmitting}
          onSubmit={flow.requestOtp}
          onBack={flow.backToCredentials}
        />
      )

    case "otp":
      return (
        <OtpStep
          isSubmitting={flow.isSubmitting}
          maskedEmail={flow.maskedEmail}
          purpose={flow.otpPurpose}
          onSubmit={flow.submitOtp}
          onResend={flow.resendOtp}
          onBack={flow.backToCredentials}
        />
      )

    case "reset":
      return (
        <ResetPasswordStep
          isSubmitting={flow.isSubmitting}
          username={flow.username}
          onSubmit={flow.submitNewPassword}
        />
      )

    default:
      return (
        <CredentialsStep
          isSubmitting={flow.isSubmitting}
          onSubmit={flow.submitCredentials}
          onForgotPassword={flow.goToForgot}
        />
      )
  }
}
