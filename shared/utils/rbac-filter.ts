import type { CmsUser, Role, StatusFilter } from "@/shared/interfaces"

import { normalize } from "./format"

export function filterRoles(
  roles: Role[],
  search: string,
  status: StatusFilter
) {
  const keyword = normalize(search)
  return roles.filter(
    (role) =>
      (!keyword || normalize(role.name).includes(keyword)) &&
      (status === "all" || role.status === status)
  )
}

export function filterUsers(
  users: CmsUser[],
  search: string,
  status: StatusFilter
) {
  const keyword = normalize(search)
  return users.filter(
    (user) =>
      (!keyword ||
        normalize(user.username).includes(keyword) ||
        normalize(user.fullName).includes(keyword) ||
        normalize(user.email).includes(keyword)) &&
      (status === "all" || user.status === status)
  )
}
