/**
 * Permission catalogue shown in the role editor.
 *
 * Note: this vocabulary is wider than PERMISSION_RESOURCES in ./permissions and
 * spells its actions in Vietnamese. The two need reconciling before the editor
 * can drive real authorization.
 */
export const PERMISSION_GROUPS = [
  {
    id: "user-groups",
    label: "Quản lý nhóm quyền",
    description: "Thiết lập vai trò và quyền truy cập",
    actions: ["Xem danh sách", "Thêm mới", "Cập nhật", "Xóa"],
  },
  {
    id: "users",
    label: "Quản lý người dùng",
    description: "Quản trị tài khoản CMS",
    actions: [
      "Xem danh sách",
      "Thêm mới",
      "Cập nhật",
      "Xóa",
      "Kích hoạt / Tạm dừng",
    ],
  },
  {
    id: "services",
    label: "Quản lý dịch vụ",
    description: "Danh mục dịch vụ HomeHub",
    actions: ["Xem danh sách", "Thêm mới", "Cập nhật", "Xóa"],
  },
  {
    id: "products",
    label: "Quản lý sản phẩm",
    description: "Sản phẩm và gói cước",
    actions: ["Xem danh sách", "Thêm mới", "Cập nhật", "Xóa"],
  },
  {
    id: "customers",
    label: "Quản lý khách hàng",
    description: "Tài khoản khách hàng HomeHub",
    actions: ["Xem danh sách", "Xem chi tiết", "Kích hoạt / Tạm dừng"],
  },
] as const

export type PermissionGroup = (typeof PERMISSION_GROUPS)[number]

export function permissionId(groupId: string, action: string) {
  return `${groupId}:${action}`
}

export const ALL_PERMISSION_IDS = PERMISSION_GROUPS.flatMap((group) =>
  group.actions.map((action) => permissionId(group.id, action))
)
