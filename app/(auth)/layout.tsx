import type { ReactNode } from "react"
import { RiShieldUserLine } from "@remixicon/react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <RiShieldUserLine className="size-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              VNPT
            </p>
            <p className="text-lg font-semibold tracking-tight">HomeHub CMS</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
