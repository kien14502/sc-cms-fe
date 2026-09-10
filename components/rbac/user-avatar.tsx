import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getInitials } from "@/shared/utils"

const tones = [
  "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
]

/** Same seed always picks the same tone, so a row keeps its colour. */
function toneFor(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash + char.charCodeAt(0)) % tones.length
  return tones[hash]
}

export function UserAvatar({
  fullName,
  seed,
  size = "lg",
  className,
}: {
  fullName: string
  seed: string
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn("text-xs font-bold", toneFor(seed))}>
        {getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  )
}
