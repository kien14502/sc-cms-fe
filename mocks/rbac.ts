import { ALL_PERMISSION_IDS } from "@/shared/constants"
import type { CmsUser, Role } from "@/shared/interfaces"

/** Placeholder data. Delete once services/ returns the real lists. */
export const initialRoles: Role[] = [
  {
    id: "role-001",
    name: "Super Admin",
    description: "Toàn quyền quản trị hệ thống HomeHub CMS",
    users: 3,
    permissions: ALL_PERMISSION_IDS,
    status: "active",
    updatedAt: "08/09/2026",
  },
  {
    id: "role-002",
    name: "Quản trị tài khoản",
    description: "Quản lý người dùng, nhóm quyền và phân quyền",
    users: 8,
    permissions: ALL_PERMISSION_IDS.filter(
      (permission) =>
        permission.startsWith("users:") || permission.startsWith("user-groups:")
    ),
    status: "active",
    updatedAt: "04/09/2026",
  },
  {
    id: "role-003",
    name: "Quản lý dịch vụ",
    description: "Quản lý danh mục dịch vụ và sản phẩm",
    users: 12,
    permissions: ALL_PERMISSION_IDS.filter(
      (permission) =>
        permission.startsWith("services:") || permission.startsWith("products:")
    ),
    status: "active",
    updatedAt: "30/08/2026",
  },
  {
    id: "role-004",
    name: "Chăm sóc khách hàng",
    description: "Tra cứu và hỗ trợ tài khoản khách hàng",
    users: 24,
    permissions: ALL_PERMISSION_IDS.filter((permission) =>
      permission.startsWith("customers:")
    ),
    status: "active",
    updatedAt: "22/08/2026",
  },
  {
    id: "role-005",
    name: "Xem báo cáo",
    description: "Chỉ có quyền xem dữ liệu và báo cáo vận hành",
    users: 6,
    permissions: [
      "services:Xem danh sách",
      "products:Xem danh sách",
      "customers:Xem danh sách",
    ],
    status: "locked",
    updatedAt: "16/08/2026",
  },
]

export const initialUsers: CmsUser[] = [
  {
    id: "usr-001",
    username: "admin.homehub",
    fullName: "Nguyễn Minh Anh",
    email: "minhanh@vnpt.vn",
    phone: "0912 345 678",
    department: "Trung tâm DVSC",
    role: "Super Admin",
    status: "active",
    createdAt: "08/09/2026",
  },
  {
    id: "usr-002",
    username: "thu.ha",
    fullName: "Trần Thu Hà",
    email: "thutha@vnpt.vn",
    phone: "0988 126 450",
    department: "Phòng Kinh doanh",
    role: "Quản trị tài khoản",
    status: "active",
    createdAt: "05/09/2026",
  },
  {
    id: "usr-003",
    username: "hoang.nam",
    fullName: "Lê Hoàng Nam",
    email: "hoangnam@vnpt.vn",
    phone: "0904 662 829",
    department: "Phòng Dịch vụ số",
    role: "Quản lý dịch vụ",
    status: "active",
    createdAt: "30/08/2026",
  },
  {
    id: "usr-004",
    username: "lan.phuong",
    fullName: "Phạm Lan Phương",
    email: "lanphuong@vnpt.vn",
    phone: "0936 402 118",
    department: "Chăm sóc khách hàng",
    role: "Chăm sóc khách hàng",
    status: "suspended",
    createdAt: "22/08/2026",
  },
  {
    id: "usr-005",
    username: "duc.trung",
    fullName: "Đỗ Đức Trung",
    email: "ductrung@vnpt.vn",
    phone: "0975 344 920",
    department: "Phòng Kế hoạch",
    role: "Xem báo cáo",
    status: "active",
    createdAt: "16/08/2026",
  },
]
