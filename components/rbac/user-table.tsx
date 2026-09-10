"use client"

import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiEditLine,
  RiEyeLine,
  RiUserForbidLine,
} from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CmsUser } from "@/shared/interfaces"

import { ListEmpty } from "./list-empty"
import { ListFooter } from "./list-footer"
import { RowAction } from "./row-action"
import { StatusBadge } from "./status-badge"
import { UserAvatar } from "./user-avatar"

export function UserTable({
  users,
  canUpdate,
  canDelete,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  users: CmsUser[]
  canUpdate: boolean
  canDelete: boolean
  onEdit: (user: CmsUser) => void
  onToggleStatus: (user: CmsUser) => void
  onDelete: (user: CmsUser) => void
}) {
  return (
    <>
      <Table className="min-w-[1080px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6">Người dùng</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Nhóm quyền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="px-6 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <UserAvatar fullName={user.fullName} seed={user.id} />
                  <div>
                    <p className="font-semibold text-foreground">
                      {user.fullName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <p className="text-foreground">{user.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user.phone}
                </p>
              </TableCell>
              <TableCell className="py-4 text-muted-foreground">
                {user.department}
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <RowAction label={`Xem ${user.username}`} icon={RiEyeLine} />
                  {canUpdate && (
                    <>
                      <RowAction
                        label={`Sửa ${user.username}`}
                        icon={RiEditLine}
                        onClick={() => onEdit(user)}
                      />
                      <RowAction
                        label={
                          user.status === "active"
                            ? `Tạm dừng ${user.username}`
                            : `Kích hoạt ${user.username}`
                        }
                        icon={
                          user.status === "active"
                            ? RiUserForbidLine
                            : RiCheckboxCircleFill
                        }
                        onClick={() => onToggleStatus(user)}
                      />
                    </>
                  )}
                  {canDelete && user.username !== "admin.homehub" && (
                    <RowAction
                      label={`Xóa ${user.username}`}
                      icon={RiDeleteBin6Line}
                      destructive
                      onClick={() => onDelete(user)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!users.length && <ListEmpty />}
      <ListFooter count={users.length} />
    </>
  )
}
