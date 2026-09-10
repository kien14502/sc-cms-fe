"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { CmsUser, UserStatus } from "@/shared/interfaces"
import type { CmsUserFormValues } from "@/shared/schemas"
import { formatDate, normalize } from "@/shared/utils"

/** User list plus its create, update, delete and status operations. */
export function useUserManager(initialUsers: CmsUser[]) {
  const [users, setUsers] = useState(initialUsers)
  const [editing, setEditing] = useState<CmsUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(user: CmsUser) {
    setEditing(user)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
  }

  function save(values: CmsUserFormValues) {
    const duplicated = users.some(
      (user) =>
        user.id !== editing?.id &&
        normalize(user.username) === normalize(values.username)
    )
    if (duplicated) {
      toast.error("Tên đăng nhập đã tồn tại")
      return
    }

    const phone = values.phone.replace(/\s/g, "")
    if (editing) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editing.id ? { ...user, ...values, phone } : user
        )
      )
      toast.success("Cập nhật người dùng thành công")
    } else {
      setUsers((current) => [
        {
          id: `usr-${Date.now()}`,
          ...values,
          phone,
          status: "suspended",
          createdAt: formatDate(),
        },
        ...current,
      ])
      toast.success("Tạo tài khoản thành công — đang ở trạng thái Tạm dừng")
    }
    setDialogOpen(false)
  }

  function remove(id: string) {
    setUsers((current) => current.filter((user) => user.id !== id))
    toast.success("Xóa tài khoản thành công")
  }

  function toggleStatus(user: CmsUser) {
    const nextStatus: UserStatus =
      user.status === "active" ? "suspended" : "active"
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item
      )
    )
    toast.success(
      nextStatus === "active"
        ? `Đã kích hoạt tài khoản ${user.username}`
        : `Đã tạm dừng tài khoản ${user.username}`
    )
  }

  return {
    users,
    editing,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
    save,
    remove,
    toggleStatus,
  }
}
