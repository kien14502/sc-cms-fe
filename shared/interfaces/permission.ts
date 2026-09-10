/** Node of GET /api/v1/permissions/tree, nested through `children`. */
export type PermissionNodeResponse = {
  id: number
  code: string
  name: string
  grantable: boolean
  children?: PermissionNodeResponse[]
}
