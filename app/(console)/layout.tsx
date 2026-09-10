import type { ReactNode } from "react"

import { AuthGuard } from "@/components/auth"

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
