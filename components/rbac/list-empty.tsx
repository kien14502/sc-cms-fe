import { RiSearchLine } from "@remixicon/react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function ListEmpty({
  message = "Không có kết quả tìm kiếm",
}: {
  message?: string
}) {
  return (
    <Empty className="min-h-64">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiSearchLine />
        </EmptyMedia>
        <EmptyTitle>{message}</EmptyTitle>
        <EmptyDescription>
          Thử thay đổi từ khóa hoặc bộ lọc trạng thái.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
