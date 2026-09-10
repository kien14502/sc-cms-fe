import { apiClient } from "@/lib/api-client"
import { API_ENDPOINT } from "@/shared/constants"
import type { PermissionNodeResponse } from "@/shared/interfaces"

export const permissionService = {
  /** The whole grantable permission catalogue, nested through `children`. */
  tree: () => apiClient<PermissionNodeResponse[]>(API_ENDPOINT.PERMISSION.TREE),
}
