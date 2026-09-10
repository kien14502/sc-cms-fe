"use client"

import { useMemo, useState } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePermission } from "@/hooks/usePermission"
import { useRoleManager } from "@/hooks/useRoleManager"
import { useUserManager } from "@/hooks/useUserManager"
import { initialRoles, initialUsers } from "@/mocks"
import type { RbacView, StatusFilter } from "@/shared/interfaces"
import { filterRoles, filterUsers } from "@/shared/utils"

import { ConfirmDialog } from "./confirm-dialog"
import { ConsoleHeader } from "./console-header"
import { ConsoleSidebar } from "./console-sidebar"
import { ConsoleTabs, ConsoleToolbar } from "./console-toolbar"
import { RoleDialog } from "./role-dialog"
import { RoleTable } from "./role-table"
import { SummaryPills } from "./summary-pills"
import { UserDialog } from "./user-dialog"
import { UserTable } from "./user-table"

type PendingDelete = { type: RbacView; id: string; name: string }

export function RbacConsole() {
  const [activeView, setActiveView] = useState<RbacView>("roles")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

  const roleManager = useRoleManager(initialRoles)
  const userManager = useUserManager(initialUsers)

  const canCreateRole = usePermission("user-groups", "create")
  const canUpdateRole = usePermission("user-groups", "update")
  const canDeleteRole = usePermission("user-groups", "delete")
  const canCreateUser = usePermission("users", "create")
  const canUpdateUser = usePermission("users", "update")
  const canDeleteUser = usePermission("users", "delete")

  const showingRoles = activeView === "roles"

  const visibleRoles = useMemo(
    () => filterRoles(roleManager.roles, search, statusFilter),
    [roleManager.roles, search, statusFilter]
  )
  const visibleUsers = useMemo(
    () => filterUsers(userManager.users, search, statusFilter),
    [userManager.users, search, statusFilter]
  )

  function changeView(view: RbacView) {
    setActiveView(view)
    setSearch("")
    setStatusFilter("all")
  }

  function confirmDelete() {
    if (!pendingDelete) return
    if (pendingDelete.type === "roles") {
      roleManager.remove(pendingDelete.id)
    } else {
      userManager.remove(pendingDelete.id)
    }
    setPendingDelete(null)
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <ConsoleSidebar activeView={activeView} onChangeView={changeView} />

        <SidebarInset>
          <ConsoleHeader activeView={activeView} />

          <div className="mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 md:py-8">
            <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Quản lý hệ thống</span>
                  <span>/</span>
                  <span className="font-medium text-primary">
                    {showingRoles ? "Nhóm quyền" : "Người dùng"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[2rem]">
                  Phân quyền người dùng
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Quản lý tài khoản và giới hạn quyền truy cập theo vai trò
                  trong HomeHub CMS.
                </p>
              </div>
              <SummaryPills
                userCount={userManager.users.length}
                roleCount={roleManager.roles.length}
                activeUserCount={
                  userManager.users.filter((user) => user.status === "active")
                    .length
                }
              />
            </div>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5">
              <Tabs
                value={activeView}
                onValueChange={(value) => changeView(value as RbacView)}
              >
                <ConsoleTabs
                  roleCount={roleManager.roles.length}
                  userCount={userManager.users.length}
                />

                <ConsoleToolbar
                  activeView={activeView}
                  search={search}
                  statusFilter={statusFilter}
                  canCreate={showingRoles ? canCreateRole : canCreateUser}
                  onSearchChange={setSearch}
                  onStatusFilterChange={setStatusFilter}
                  onCreate={
                    showingRoles
                      ? roleManager.openCreate
                      : userManager.openCreate
                  }
                />

                <TabsContent value="roles">
                  <RoleTable
                    roles={visibleRoles}
                    canUpdate={canUpdateRole}
                    canDelete={canDeleteRole}
                    onEdit={roleManager.openEdit}
                    onDelete={(role) =>
                      setPendingDelete({
                        type: "roles",
                        id: role.id,
                        name: role.name,
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="users">
                  <UserTable
                    users={visibleUsers}
                    canUpdate={canUpdateUser}
                    canDelete={canDeleteUser}
                    onEdit={userManager.openEdit}
                    onToggleStatus={userManager.toggleStatus}
                    onDelete={(user) =>
                      setPendingDelete({
                        type: "users",
                        id: user.id,
                        name: user.username,
                      })
                    }
                  />
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {roleManager.dialogOpen && (
        <RoleDialog
          role={roleManager.editing}
          onClose={roleManager.closeDialog}
          onSubmit={roleManager.save}
        />
      )}

      {userManager.dialogOpen && (
        <UserDialog
          user={userManager.editing}
          roles={roleManager.roles.filter((role) => role.status === "active")}
          onClose={userManager.closeDialog}
          onSubmit={userManager.save}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={
            pendingDelete.type === "roles"
              ? "Xóa nhóm quyền?"
              : "Xóa tài khoản?"
          }
          description={
            pendingDelete.type === "roles"
              ? `Nhóm “${pendingDelete.name}” sẽ bị xóa và người dùng thuộc nhóm sẽ mất các quyền tương ứng.`
              : `Tài khoản “${pendingDelete.name}” sẽ bị xóa khỏi danh sách người dùng CMS.`
          }
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </TooltipProvider>
  )
}
