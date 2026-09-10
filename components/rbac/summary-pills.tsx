import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const tones = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/25 bg-success/10 text-success",
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: keyof typeof tones
}) {
  return (
    <Card
      className={cn("min-w-28 gap-1 rounded-xl px-3.5 py-2.5", tones[tone])}
    >
      <p className="text-lg leading-none font-bold">{value}</p>
      <p className="text-[11px] font-medium whitespace-nowrap opacity-75">
        {label}
      </p>
    </Card>
  )
}

export function SummaryPills({
  userCount,
  roleCount,
  activeUserCount,
}: {
  userCount: number
  roleCount: number
  activeUserCount: number
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:flex">
      <SummaryPill label="Người dùng" value={userCount} tone="primary" />
      <SummaryPill label="Nhóm quyền" value={roleCount} tone="neutral" />
      <SummaryPill
        label="Đang hoạt động"
        value={activeUserCount}
        tone="success"
      />
    </div>
  )
}
