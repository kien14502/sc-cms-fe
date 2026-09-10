import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RoleStatus, UserStatus } from "@/shared/interfaces"

export function StatusBadge({ status }: { status: RoleStatus | UserStatus }) {
  const active = status === "active"
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full border-transparent font-semibold",
        active ? "bg-success/12 text-success" : "bg-warning/15 text-warning"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-success" : "bg-warning"
        )}
      />
      {active ? "Hoạt động" : "Tạm dừng"}
    </Badge>
  )
}
