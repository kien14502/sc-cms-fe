import { PERMISSION_ACTIONS, PERMISSION_RESOURCES } from "@/shared/constants"
import type { AccountResponse, AuthUser, Permission } from "@/shared/interfaces"

/**
 * TODO: replace with the caller's real grants. The API has no endpoint for the
 * signed-in account's permissions: /account/me returns only `roleName`, and
 * /permissions/tree is the whole catalogue rather than what this user holds.
 * Until the backend exposes them, every signed-in account gets the full matrix,
 * which means usePermission cannot gate anything yet.
 */
const everyPermission: Permission[] = PERMISSION_RESOURCES.flatMap((resource) =>
  PERMISSION_ACTIONS.map((action) => ({ resource, action }))
)

export function toAuthUser(account: AccountResponse): AuthUser {
  return { ...account, permissions: everyPermission }
}
