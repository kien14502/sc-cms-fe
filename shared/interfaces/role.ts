import type { ApiRoleStatus } from "./api"
import type { PermissionNodeResponse } from "./permission"

/** Row of GET /api/v1/roles */
export type RoleListItemResponse = {
  id: number
  name: string
  status: ApiRoleStatus
  createdAt: string
}

/** GET /api/v1/roles/{id} */
export type RoleDetailResponse = {
  id: number
  name: string
  description: string
  status: ApiRoleStatus
  system: boolean
  permissions: PermissionNodeResponse[]
}

export type RoleWriteRequest = {
  name: string
  description?: string
  status?: ApiRoleStatus
  permissionIds: number[]
}
