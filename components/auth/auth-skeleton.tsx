import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder shown while the persisted session is read back. */
export function AuthSkeleton() {
  return (
    <div className="space-y-4 rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}
