"use client"

import {
  RiDeleteBin6Line,
  RiEditLine,
  RiEyeLine,
  RiGroupLine,
  RiShieldUserLine,
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
import type { Role } from "@/shared/interfaces"

import { ListEmpty } from "./list-empty"
import { ListFooter } from "./list-footer"
import { RowAction } from "./row-action"
import { StatusBadge } from "./status-badge"

export function RoleTable({
  roles,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: {
  roles: Role[]
  canUpdate: boolean
  canDelete: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}) {
  return (
    <>
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6">Nhóm quyền</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead>Quyền đã cấp</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Cập nhật</TableHead>
            <TableHead className="px-6 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className="group">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15">
                    <RiShieldUserLine className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{role.name}</p>
                    <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <RiGroupLine className="size-4 text-muted-foreground" />
                  {role.users}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary">
                  {role.permissions.length} quyền
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={role.status} />
              </TableCell>
              <TableCell className="py-4 text-muted-foreground">
                {role.updatedAt}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <RowAction label={`Xem ${role.name}`} icon={RiEyeLine} />
                  {canUpdate && (
                    <RowAction
                      label={`Sửa ${role.name}`}
                      icon={RiEditLine}
                      onClick={() => onEdit(role)}
                    />
                  )}
                  {canDelete && role.name !== "Super Admin" && (
                    <RowAction
                      label={`Xóa ${role.name}`}
                      icon={RiDeleteBin6Line}
                      destructive
                      onClick={() => onDelete(role)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!roles.length && <ListEmpty />}
      <ListFooter count={roles.length} />
    </>
  )
}
