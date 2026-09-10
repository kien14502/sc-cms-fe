import { z } from "zod"

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên nhóm quyền không được để trống")
    .max(200, "Tên nhóm quyền nhập tối đa 200 ký tự"),
  description: z.string().trim().max(300, "Mô tả tối đa 300 ký tự"),
  status: z.enum(["active", "locked"]),
  permissions: z.array(z.string()).min(1, "Quyền truy cập chưa được chọn"),
})

export const cmsUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Tên đăng nhập không được để trống")
    .max(100, "Tên đăng nhập tối đa 100 ký tự")
    .regex(/^[a-zA-Z0-9._-]+$/, "Tên đăng nhập chứa ký tự không hợp lệ"),
  fullName: z
    .string()
    .trim()
    .min(1, "Họ tên không được để trống")
    .max(100, "Họ tên tối đa 100 ký tự"),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
  phone: z
    .string()
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|84)\d{9,10}$/, "Số điện thoại không đúng định dạng"),
  department: z.string().trim().min(1, "Phòng ban không được để trống"),
  role: z.string().min(1, "Vui lòng chọn nhóm quyền"),
})

export type RoleFormValues = z.infer<typeof roleSchema>
export type CmsUserFormValues = z.infer<typeof cmsUserSchema>
