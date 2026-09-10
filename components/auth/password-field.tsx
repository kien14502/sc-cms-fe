"use client"

import { useState } from "react"
import type { ComponentProps } from "react"
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

/** Password input with the reveal toggle every password field in the spec has. */
export function PasswordField({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) {
  const [visible, setVisible] = useState(false)

  return (
    <InputGroup className={className}>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <RiEyeOffLine /> : <RiEyeLine />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
