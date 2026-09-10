export type RoleStatus = "active" | "locked"
export type UserStatus = "active" | "suspended"

export type Role = {
  id: string
  name: string
  description: string
  users: number
  permissions: string[]
  status: RoleStatus
  updatedAt: string
}

export type CmsUser = {
  id: string
  username: string
  fullName: string
  email: string
  phone: string
  department: string
  role: string
  status: UserStatus
  createdAt: string
}

/** Which list the console is showing. */
export type RbacView = "roles" | "users"

/** Status dropdown value, shared by both lists. */
export type StatusFilter = "all" | RoleStatus | UserStatus
