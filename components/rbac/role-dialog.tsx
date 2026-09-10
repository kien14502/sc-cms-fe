"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"
import type { Role } from "@/shared/interfaces"
import { roleSchema, type RoleFormValues } from "@/shared/schemas"

import { PermissionPicker } from "./permission-picker"

const statusLabels = { active: "Hoạt động", locked: "Tạm dừng" }

export function RoleDialog({
  role,
  onClose,
  onSubmit,
}: {
  role: Role | null
  onClose: () => void
  onSubmit: (values: RoleFormValues) => void
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name ?? "",
      description: role?.description ?? "",
      status: role?.status ?? "active",
      permissions: role?.permissions ?? [],
    },
  })
  const permissions = useWatch({ control, name: "permissions" })

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="border-b border-border p-5 md:p-6">
            <DialogTitle>
              {role ? "Cập nhật nhóm quyền" : "Tạo nhóm quyền"}
            </DialogTitle>
            <DialogDescription>
              Quyền được gán cho vai trò sẽ áp dụng tới mọi tài khoản thuộc
              nhóm.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[62vh] space-y-6 overflow-y-auto p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="role-name">
                  Tên nhóm quyền <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="role-name"
                  autoFocus
                  maxLength={200}
                  placeholder="Ví dụ: Quản trị nội dung"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="role-status">
                  Trạng thái <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      items={statusLabels}
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as RoleFormValues["status"])
                      }
                    >
                      <SelectTrigger id="role-status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="locked">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="role-description">Mô tả</FieldLabel>
              <Textarea
                id="role-description"
                className="min-h-20"
                maxLength={300}
                placeholder="Mô tả ngắn phạm vi của nhóm quyền"
                {...register("description")}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>

            <PermissionPicker
              value={permissions}
              error={errors.permissions?.message}
              onChange={(next) =>
                setValue("permissions", next, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>

          <DialogFooter className="border-t border-border bg-muted/40 p-5 md:p-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {role ? "Lưu thay đổi" : "Tạo nhóm quyền"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
