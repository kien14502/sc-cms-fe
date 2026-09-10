"use client"

import { PermissionAction, PermissionResource } from "@/shared/constants"
import { useAuthStore } from "@/stores/auth-store"

export function usePermission(
  resource: PermissionResource,
  action: PermissionAction
) {
  return useAuthStore((state) =>
    Boolean(
      state.user?.permissions.some(
        (permission) =>
          permission.resource === resource && permission.action === action
      )
    )
  )
}
