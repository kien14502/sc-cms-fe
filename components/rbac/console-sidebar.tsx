"use client"

import { useRouter } from "next/navigation"
import {
  RiCustomerService2Line,
  RiDashboardLine,
  RiFileList3Line,
  RiKey2Line,
  RiLogoutBoxRLine,
  RiSettings3Line,
  RiShieldUserLine,
  RiUserLine,
} from "@remixicon/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { authService } from "@/services"
import type { RbacView } from "@/shared/interfaces"
import { useAuthStore } from "@/stores/auth-store"

import { UserAvatar } from "./user-avatar"

const navItems = [
  { icon: RiDashboardLine, label: "Tổng quan" },
  { icon: RiShieldUserLine, label: "Quản lý hệ thống", active: true },
  { icon: RiSettings3Line, label: "Quản lý dịch vụ" },
  { icon: RiFileList3Line, label: "Quản lý sản phẩm" },
  { icon: RiCustomerService2Line, label: "Quản lý khách hàng" },
]

const subNavItems = [
  { view: "users" as const, icon: RiUserLine, label: "Người dùng" },
  { view: "roles" as const, icon: RiKey2Line, label: "Nhóm quyền" },
]

export function ConsoleSidebar({
  activeView,
  onChangeView,
}: {
  activeView: RbacView
  onChangeView: (view: RbacView) => void
}) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    // UC002. The local session is dropped even if the server call fails.
    try {
      await authService.logout()
    } finally {
      logout()
      router.replace("/login")
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-20 justify-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <RiShieldUserLine className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sidebar-foreground/60 uppercase">
              VNPT
            </p>
            <p className="text-lg font-semibold tracking-tight">HomeHub CMS</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vận hành hệ thống</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active}>
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.active && (
                    <SidebarMenuSub>
                      {subNavItems.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <SidebarMenuSubItem key={subItem.view}>
                            <SidebarMenuSubButton
                              isActive={activeView === subItem.view}
                              render={
                                <button
                                  type="button"
                                  onClick={() => onChangeView(subItem.view)}
                                />
                              }
                            >
                              <SubIcon />
                              <span>{subItem.label}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <UserAvatar
                  fullName={user?.fullName ?? ""}
                  seed={String(user?.id ?? "")}
                />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">
                    {user?.fullName}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.roleName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem onClick={handleLogout}>
                  <RiLogoutBoxRLine />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
