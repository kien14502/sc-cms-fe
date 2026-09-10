"use client"

import type { RemixiconComponentType } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** Icon-only action in a table row, labelled for screen readers and on hover. */
export function RowAction({
  label,
  icon: Icon,
  destructive,
  onClick,
}: {
  label: string
  icon: RemixiconComponentType
  destructive?: boolean
  onClick?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
            className={cn(
              "text-muted-foreground",
              destructive
                ? "hover:bg-destructive/10 hover:text-destructive"
                : "hover:bg-primary/10 hover:text-primary"
            )}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
