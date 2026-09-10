import type { Metadata } from "next"

import { LoginFlow } from "@/components/auth"

export const metadata: Metadata = {
  title: "Đăng nhập | HomeHub CMS",
  description: "Đăng nhập hệ thống quản trị HomeHub CMS",
}

export default function Page() {
  return <LoginFlow />
}
