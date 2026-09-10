"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { Role } from "@/shared/interfaces"
import type { RoleFormValues } from "@/shared/schemas"
import { formatDate, normalize } from "@/shared/utils"

/** Role list plus its create, update and delete operations. */
export function useRoleManager(initialRoles: Role[]) {
  const [roles, setRoles] = useState(initialRoles)
  const [editing, setEditing] = useState<Role | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(role: Role) {
    setEditing(role)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
  }

  function save(values: RoleFormValues) {
    const duplicated = roles.some(
      (role) =>
        role.id !== editing?.id &&
        normalize(role.name) === normalize(values.name)
    )
    if (duplicated) {
      toast.error("Tên nhóm quyền đã tồn tại")
      return
    }

    if (editing) {
      setRoles((current) =>
        current.map((role) =>
          role.id === editing.id
            ? { ...role, ...values, updatedAt: formatDate() }
            : role
        )
      )
      toast.success("Cập nhật thông tin nhóm quyền thành công")
    } else {
      setRoles((current) => [
        {
          id: `role-${Date.now()}`,
          users: 0,
          updatedAt: formatDate(),
          ...values,
        },
        ...current,
      ])
      toast.success("Tạo mới nhóm quyền thành công")
    }
    setDialogOpen(false)
  }

  function remove(id: string) {
    setRoles((current) => current.filter((role) => role.id !== id))
    toast.success("Xóa nhóm quyền thành công")
  }

  return {
    roles,
    editing,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
    save,
    remove,
  }
}
