/** Every response from the backend is wrapped in this envelope. */
export type ApiEnvelope<T> = {
  code?: string
  message?: string
  data: T
}

/** Shape of `data` on every paginated endpoint. */
export type PageResponse<T> = {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Spring's Pageable, flattened into query params. */
export type PageParams = {
  page?: number
  size?: number
  sort?: string[]
}

export type ApiStatus = "ACTIVE" | "INACTIVE"
export type ApiRoleStatus = "ACTIVE" | "LOCKED"

/** What apiClientList hands back to callers. */
export type ApiListResult<T> = {
  data: T[]
  total: number
}
