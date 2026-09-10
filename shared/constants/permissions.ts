export const PERMISSION_RESOURCES = [
  "users",
  "user-groups",
  "permissions",
] as const

export const PERMISSION_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
] as const

export type PermissionResource = (typeof PERMISSION_RESOURCES)[number]
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]
