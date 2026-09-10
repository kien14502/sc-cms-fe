"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { RbacView } from "@/shared/interfaces"
import { useAuthStore } from "@/stores/auth-store"

import { UserAvatar } from "./user-avatar"

export function ConsoleHeader({ activeView }: { activeView: RbacView }) {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Quản lý hệ thống
          </p>
          <p className="text-sm font-semibold text-foreground md:hidden">
            {activeView === "roles" ? "Nhóm quyền" : "Người dùng"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="hidden gap-2 rounded-full border-success/30 bg-success/10 font-semibold text-success sm:flex"
        >
          <span className="size-2 rounded-full bg-success" />
          Hệ thống ổn định
        </Badge>
        <Separator orientation="vertical" className="h-8" />
        <UserAvatar
          fullName={user?.fullName ?? ""}
          seed={String(user?.id ?? "")}
          size="default"
        />
      </div>
    </header>
  )
}
