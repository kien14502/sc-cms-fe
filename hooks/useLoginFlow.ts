"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { accountService, authService } from "@/services"
import type { LoginStep, OtpPurpose } from "@/shared/interfaces"
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
} from "@/shared/schemas"
import { toAuthUser } from "@/shared/utils"
import { useAuthStore } from "@/stores/auth-store"

const REMEMBERED_USERNAME_KEY = "homehub-cms-remembered-username"

/**
 * The spec's "ghi nhớ đăng nhập" stores user and password. This only stores the
 * username and prefills it; keeping a password in localStorage is not worth it.
 */
export function readRememberedUsername() {
  if (typeof window === "undefined") return ""
  try {
    return window.localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? ""
  } catch {
    return ""
  }
}

function writeRememberedUsername(username: string | null) {
  try {
    if (username) {
      window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username)
    } else {
      window.localStorage.removeItem(REMEMBERED_USERNAME_KEY)
    }
  } catch {
    // A browser with storage disabled just forgets the username.
  }
}

/**
 * Drives the four cards of UC001 from a single route. Both OTP branches are
 * addressed by the `otpToken` the previous step returned, which is why they are
 * steps of one route rather than separate pages.
 */
export function useLoginFlow() {
  const router = useRouter()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  const [step, setStep] = useState<LoginStep>("credentials")
  const [username, setUsername] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("login")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function backToCredentials() {
    setStep("credentials")
    setMaskedEmail("")
    setOtpToken("")
    setResetToken("")
  }

  /**
   * Returns false when the step failed, so a card can clear its own inputs.
   * apiClient has already shown the backend's message, so nothing is toasted
   * here.
   */
  async function run(action: () => Promise<void>) {
    setIsSubmitting(true)
    try {
      await action()
      return true
    } catch {
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    maskedEmail,
    username,
    otpPurpose,
    isSubmitting,
    goToForgot: () => setStep("forgot"),
    backToCredentials,

    submitCredentials: (values: LoginFormValues) =>
      run(async () => {
        const challenge = await authService.login({
          username: values.username,
          password: values.password,
        })
        writeRememberedUsername(values.remember ? values.username : null)
        setUsername(values.username)
        setOtpToken(challenge.otpToken)
        setMaskedEmail(challenge.maskedEmail)
        setOtpPurpose("login")
        setStep("otp")
      }),

    requestOtp: (values: ForgotPasswordFormValues) =>
      run(async () => {
        const challenge = await authService.forgotPassword({
          username: values.username,
        })
        setUsername(values.username)
        setOtpToken(challenge.otpToken)
        setMaskedEmail(challenge.maskedEmail)
        setOtpPurpose("reset")
        setStep("otp")
      }),

    resendOtp: () =>
      run(async () => {
        const challenge = await authService.resendOtp({ otpToken })
        setOtpToken(challenge.otpToken)
        setMaskedEmail(challenge.maskedEmail)
        toast.success("Đã gửi lại mã OTP")
      }),

    submitOtp: (values: OtpFormValues) =>
      run(async () => {
        if (otpPurpose === "login") {
          const tokens = await authService.verifyOtp({
            otpToken,
            otp: values.otp,
          })
          setTokens(tokens)
          setUser(toAuthUser(await accountService.me()))

          // TODO: UC001 wants a forced change-password screen here.
          if (tokens.passwordExpired) {
            toast.warning("Mật khẩu đã hết hạn, vui lòng đổi mật khẩu mới")
          }

          router.replace("/")
          return
        }

        const { resetToken: token } = await authService.forgotPasswordVerifyOtp(
          { otpToken, otp: values.otp }
        )
        setResetToken(token)
        setStep("reset")
      }),

    submitNewPassword: (values: ResetPasswordFormValues) =>
      run(async () => {
        await authService.resetPassword({
          resetToken,
          newPassword: values.password,
        })
        toast.success("Cập nhật mật khẩu thành công")
        backToCredentials()
      }),
  }
}
