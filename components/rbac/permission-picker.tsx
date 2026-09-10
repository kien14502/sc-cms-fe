"use client"

import { useId } from "react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { PERMISSION_GROUPS, permissionId } from "@/shared/constants"

/** Module and action checkboxes for the role editor. */
export function PermissionPicker({
  value,
  error,
  onChange,
}: {
  value: string[]
  error?: string
  onChange: (next: string[]) => void
}) {
  const fieldId = useId()

  function toggle(permission: string, checked: boolean) {
    onChange(
      checked
        ? [...new Set([...value, permission])]
        : value.filter((item) => item !== permission)
    )
  }

  function toggleGroup(
    groupId: string,
    actions: readonly string[],
    checked: boolean
  ) {
    const groupPermissions = actions.map((action) =>
      permissionId(groupId, action)
    )
    onChange(
      checked
        ? [...new Set([...value, ...groupPermissions])]
        : value.filter((item) => !groupPermissions.includes(item))
    )
  }

  return (
    <FieldSet>
      <FieldLegend variant="label">
        Quyền truy cập <span className="text-destructive">*</span>
      </FieldLegend>
      <div className="-mt-2 flex items-center justify-between gap-3">
        <FieldDescription>
          Chọn module và thao tác được phép thực hiện.
        </FieldDescription>
        <Badge className="bg-primary/10 text-primary">
          {value.length} quyền đã chọn
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {PERMISSION_GROUPS.map((group) => {
          const groupPermissions = group.actions.map((action) =>
            permissionId(group.id, action)
          )
          const allSelected = groupPermissions.every((permission) =>
            value.includes(permission)
          )
          const groupInputId = `${fieldId}-${group.id}`
          return (
            <div
              key={group.id}
              className="border-b border-border last:border-0"
            >
              <Field
                orientation="horizontal"
                className="items-start bg-muted/50 px-4 py-3.5"
              >
                <Checkbox
                  id={groupInputId}
                  className="mt-0.5"
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    toggleGroup(group.id, group.actions, checked === true)
                  }
                />
                <FieldLabel htmlFor={groupInputId} className="font-normal">
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {group.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {group.description}
                    </span>
                  </span>
                </FieldLabel>
              </Field>

              <div className="grid gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.actions.map((action) => {
                  const permission = permissionId(group.id, action)
                  const inputId = `${fieldId}-${permission}`
                  return (
                    <Field
                      key={permission}
                      orientation="horizontal"
                      className="rounded-lg px-2 py-2 hover:bg-primary/10"
                    >
                      <Checkbox
                        id={inputId}
                        checked={value.includes(permission)}
                        onCheckedChange={(checked) =>
                          toggle(permission, checked === true)
                        }
                      />
                      <FieldLabel
                        htmlFor={inputId}
                        className="font-normal text-muted-foreground"
                      >
                        {action}
                      </FieldLabel>
                    </Field>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {error && <FieldError>{error}</FieldError>}
    </FieldSet>
  )
}
