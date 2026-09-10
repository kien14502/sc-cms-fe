"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuthHydrated } from "@/hooks/useAuthHydrated"
import { useAuthStore } from "@/stores/auth-store"

function ConsoleSkeleton() {
  return (
    <div className="flex min-h-svh gap-6 p-6">
      <Skeleton className="hidden h-full w-64 shrink-0 rounded-xl md:block" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  )
}

/** Keeps the console behind the login route. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const hydrated = useAuthHydrated()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (hydrated && !user) router.replace("/login")
  }, [hydrated, user, router])

  if (!hydrated || !user) return <ConsoleSkeleton />

  return <>{children}</>
}
