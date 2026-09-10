"use client"

import {
  RiAddLine,
  RiGroupLine,
  RiSearchLine,
  RiShieldUserLine,
  RiUserAddLine,
} from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RbacView, StatusFilter } from "@/shared/interfaces"

export function ConsoleTabs({
  roleCount,
  userCount,
}: {
  roleCount: number
  userCount: number
}) {
  return (
    <div className="border-b border-border px-4 pt-4 md:px-6">
      <TabsList variant="line" aria-label="Phân quyền người dùng">
        <TabsTrigger value="roles">
          <RiShieldUserLine />
          Nhóm quyền
          <Badge variant="secondary">{roleCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="users">
          <RiGroupLine />
          Người dùng
          <Badge variant="secondary">{userCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </div>
  )
}

export function ConsoleToolbar({
  activeView,
  search,
  statusFilter,
  canCreate,
  onSearchChange,
  onStatusFilterChange,
  onCreate,
}: {
  activeView: RbacView
  search: string
  statusFilter: StatusFilter
  canCreate: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: StatusFilter) => void
  onCreate: () => void
}) {
  const showingRoles = activeView === "roles"
  const pausedValue: StatusFilter = showingRoles ? "locked" : "suspended"
  const statusLabels: Record<string, string> = {
    all: "Tất cả trạng thái",
    active: "Hoạt động",
    [pausedValue]: "Tạm dừng",
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <InputGroup className="h-10 w-full max-w-md rounded-xl">
          <InputGroupAddon>
            <RiSearchLine />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            maxLength={200}
            aria-label="Tìm kiếm"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              showingRoles
                ? "Tìm theo tên nhóm quyền..."
                : "Tìm tên, tài khoản hoặc email..."
            }
          />
        </InputGroup>

        <Select
          items={statusLabels}
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
        >
          <SelectTrigger
            aria-label="Lọc trạng thái"
            className="h-10 w-full rounded-xl sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value={pausedValue}>Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {canCreate && (
        <Button className="h-10 rounded-xl px-4" onClick={onCreate}>
          {showingRoles ? (
            <RiAddLine data-icon="inline-start" />
          ) : (
            <RiUserAddLine data-icon="inline-start" />
          )}
          {showingRoles ? "Tạo nhóm quyền" : "Tạo tài khoản"}
        </Button>
      )}
    </div>
  )
}
