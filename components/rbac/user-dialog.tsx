"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RiLockLine } from "@remixicon/react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CmsUser, Role } from "@/shared/interfaces"
import { cmsUserSchema, type CmsUserFormValues } from "@/shared/schemas"

export function UserDialog({
  user,
  roles,
  onClose,
  onSubmit,
}: {
  user: CmsUser | null
  roles: Role[]
  onClose: () => void
  onSubmit: (values: CmsUserFormValues) => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CmsUserFormValues>({
    resolver: zodResolver(cmsUserSchema),
    defaultValues: {
      username: user?.username ?? "",
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone.replace(/\s/g, "") ?? "",
      department: user?.department ?? "",
      role: user?.role ?? "",
    },
  })

  const roleLabels = Object.fromEntries(
    roles.map((role) => [role.name, role.name])
  )

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="border-b border-border p-5 md:p-6">
            <DialogTitle>
              {user ? "Cập nhật người dùng" : "Tạo tài khoản"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "Tên đăng nhập không thể thay đổi sau khi tạo."
                : "Tài khoản mới sẽ ở trạng thái Tạm dừng cho đến khi được kích hoạt."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[62vh] gap-4 overflow-y-auto p-5 md:grid-cols-2 md:p-6">
            <Field data-invalid={Boolean(errors.username)}>
              <FieldLabel htmlFor="user-username">
                Tên đăng nhập <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="user-username"
                autoFocus
                readOnly={Boolean(user)}
                aria-readonly={Boolean(user)}
                aria-invalid={Boolean(errors.username)}
                maxLength={100}
                placeholder="ten.dangnhap"
                className={user ? "cursor-not-allowed bg-muted" : undefined}
                {...register("username")}
              />
              {errors.username && (
                <FieldError>{errors.username.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.fullName)}>
              <FieldLabel htmlFor="user-fullname">
                Họ và tên <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="user-fullname"
                maxLength={100}
                placeholder="Nguyễn Văn A"
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
              {errors.fullName && (
                <FieldError>{errors.fullName.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="user-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="user-email"
                type="email"
                maxLength={100}
                placeholder="email@vnpt.vn"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(errors.phone)}>
              <FieldLabel htmlFor="user-phone">
                Số điện thoại <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="user-phone"
                inputMode="numeric"
                maxLength={12}
                placeholder="0912345678"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(errors.department)}>
              <FieldLabel htmlFor="user-department">
                Phòng ban <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="user-department"
                placeholder="Phòng / Trung tâm"
                aria-invalid={Boolean(errors.department)}
                {...register("department")}
              />
              {errors.department && (
                <FieldError>{errors.department.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.role)}>
              <FieldLabel htmlFor="user-role">
                Nhóm quyền <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    items={roleLabels}
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger id="user-role" className="w-full">
                      <SelectValue placeholder="Chọn nhóm quyền" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <FieldError>{errors.role.message}</FieldError>}
            </Field>

            {!user && (
              <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-sm text-foreground md:col-span-2">
                <RiLockLine className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="leading-6">
                  Mật khẩu tạm thời sẽ được hệ thống tạo và gửi đến email của
                  người dùng sau khi tài khoản được kích hoạt.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border bg-muted/40 p-5 md:p-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {user ? "Lưu thay đổi" : "Tạo tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
