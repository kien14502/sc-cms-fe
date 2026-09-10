"use client"

import { toast } from "sonner"

import { API_ENDPOINT } from "@/shared/constants"
import type {
  ApiEnvelope,
  ApiListResult,
  PageResponse,
  TokenResponse,
} from "@/shared/interfaces"
import { useAuthStore } from "@/stores/auth-store"

type ToastVariant = "success" | "info" | "warning" | "error"
type ApiClientToast =
  | string
  | {
      message: string
      type?: ToastVariant
    }

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

type ApiClientOptions = RequestInit & {
  showErrorToast?: boolean
  successToast?: ApiClientToast
  fallbackErrorMessage?: string
  skipAuthRefresh?: boolean
  /** Leaves the Authorization header off, for the pre-login calls. */
  skipAuthHeader?: boolean
  _isRetry?: boolean
}

/** Backend origin. The OpenAPI document ships localhost:8080 as the default. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

function resolveUrl(input: RequestInfo | URL) {
  if (typeof input !== "string") return input
  if (/^https?:\/\//i.test(input)) return input
  return `${API_BASE_URL}${input}`
}

function buildHeaders(options: ApiClientOptions) {
  const headers = new Headers(options.headers)

  // Every request body in this API is JSON, so the call sites stop repeating it.
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (!options.skipAuthHeader && !headers.has("Authorization")) {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
  }

  return headers
}

// Singleton prevents concurrent refresh calls when multiple requests hit 401 simultaneously
let refreshingPromise: Promise<boolean> | null = null

async function tryRefreshToken(): Promise<boolean> {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) return false

  if (!refreshingPromise) {
    refreshingPromise = fetch(resolveUrl(API_ENDPOINT.AUTH.REFRESH), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return false

        const body = (await response.json()) as ApiEnvelope<TokenResponse>
        if (!body?.data?.accessToken) return false

        useAuthStore.getState().setTokens(body.data)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshingPromise = null
      })
  }
  return refreshingPromise
}

function handleSessionExpired() {
  useAuthStore.getState().logout()
  toast.error("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại")
  setTimeout(() => {
    window.location.href = "/login"
  }, 1000)
}

function showToast(toastOption: ApiClientToast, defaultType: ToastVariant) {
  const message =
    typeof toastOption === "string" ? toastOption : toastOption.message
  const type =
    typeof toastOption === "string"
      ? defaultType
      : (toastOption.type ?? defaultType)

  toast[type](message)
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body !== "object" || body === null) return fallback

  const record = body as Record<string, unknown>
  if (typeof record.errorMessage === "string") return record.errorMessage
  if (typeof record.message === "string") return record.message

  return fallback
}

async function readResponseBody(response: Response) {
  if (response.status === 204) return null

  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

/** Pulls `data` out of the `{ code, message, data }` envelope. */
function unwrapEnvelope<T>(body: unknown): T {
  if (typeof body === "object" && body !== null && "data" in body) {
    return (body as ApiEnvelope<T>).data
  }
  return body as T
}

/** Drops this module's own options so the rest can go straight to fetch. */
function toFetchOptions(options: ApiClientOptions): RequestInit {
  const fetchOptions: Record<string, unknown> = { ...options }
  for (const key of [
    "showErrorToast",
    "successToast",
    "fallbackErrorMessage",
    "skipAuthRefresh",
    "skipAuthHeader",
    "_isRetry",
  ]) {
    delete fetchOptions[key]
  }
  return fetchOptions as RequestInit
}

/**
 * Runs the request, refreshing the token once on a 401, and returns the raw
 * body. Both public helpers differ only in how they read that body.
 */
async function request(
  input: RequestInfo | URL,
  options: ApiClientOptions,
  retry: () => Promise<unknown>
) {
  const {
    showErrorToast = true,
    fallbackErrorMessage = "Có lỗi xảy ra, vui lòng thử lại",
    skipAuthRefresh = false,
    _isRetry = false,
  } = options

  const response = await fetch(resolveUrl(input), {
    ...toFetchOptions(options),
    headers: buildHeaders(options),
  })

  if (response.status === 401 && !_isRetry && !skipAuthRefresh) {
    if (await tryRefreshToken()) return { retried: true, value: await retry() }

    handleSessionExpired()
    throw new ApiClientError("Phiên làm việc đã hết hạn", 401)
  }

  const body = await readResponseBody(response)

  if (!response.ok) {
    const message = getErrorMessage(body, fallbackErrorMessage)
    if (showErrorToast) toast.error(message)
    throw new ApiClientError(message, response.status, body)
  }

  return { retried: false as const, value: body }
}

function toClientError(error: unknown, options: ApiClientOptions) {
  const {
    showErrorToast = true,
    fallbackErrorMessage = "Có lỗi xảy ra, vui lòng thử lại",
  } = options

  if (error instanceof ApiClientError) return error
  if (error instanceof DOMException && error.name === "AbortError") return error

  if (showErrorToast) toast.error(fallbackErrorMessage)
  return new ApiClientError(fallbackErrorMessage, 0)
}

/** Single resource. Returns the unwrapped `data` field. */
export async function apiClient<T>(
  input: RequestInfo | URL,
  options: ApiClientOptions = {}
): Promise<T> {
  try {
    const result = await request(input, options, () =>
      apiClient<T>(input, { ...options, _isRetry: true })
    )
    if (result.retried) return result.value as T

    if (options.successToast) showToast(options.successToast, "success")
    return unwrapEnvelope<T>(result.value)
  } catch (error) {
    throw toClientError(error, options)
  }
}

/** Paginated list. Returns the page's items plus the total row count. */
export async function apiClientList<T>(
  input: RequestInfo | URL,
  options: ApiClientOptions = {}
): Promise<ApiListResult<T>> {
  try {
    const result = await request(input, options, () =>
      apiClientList<T>(input, { ...options, _isRetry: true })
    )
    if (result.retried) return result.value as ApiListResult<T>

    const page = unwrapEnvelope<PageResponse<T>>(result.value)
    if (!Array.isArray(page?.items) || typeof page.totalElements !== "number") {
      throw new ApiClientError(
        "Phản hồi danh sách không hợp lệ",
        200,
        result.value
      )
    }

    if (options.successToast) showToast(options.successToast, "success")
    return { data: page.items, total: page.totalElements }
  } catch (error) {
    if (
      error instanceof ApiClientError &&
      error.message === "Phản hồi danh sách không hợp lệ" &&
      options.showErrorToast !== false
    ) {
      toast.error(error.message)
    }
    throw toClientError(error, options)
  }
}
