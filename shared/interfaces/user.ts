import type { ApiStatus } from "./api"

/** Row of GET /api/v1/users */
export type UserListItemResponse = {
  id: number
  username: string
  fullName: string
  department: string
  phone: string
  email: string
  roleName: string
  status: ApiStatus
  createdAt: string
}

/** GET /api/v1/users/{id} */
export type UserDetailResponse = {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  department: string
  status: ApiStatus
  roleId: number
  roleName: string
  passwordExpiresAt: string
}

export type UserSearchParams = {
  keyword?: string
  roleId?: number
  status?: ApiStatus
}

export type UserCreateRequest = {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  department?: string
  roleId: number
}

export type UserUpdateRequest = {
  fullName: string
  email: string
  phone: string
  department?: string
  roleId: number
  status: ApiStatus
}
