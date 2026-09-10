import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

/**
 * Single static page. The requirements document asks for 20 records per page;
 * wiring that needs the list endpoint.
 */
export function ListFooter({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        Hiển thị{" "}
        <strong className="font-semibold text-foreground">{count}</strong> kết
        quả
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="Trước"
              aria-disabled
              aria-label="Trang trước"
              className="pointer-events-none opacity-40"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              text="Sau"
              aria-disabled
              aria-label="Trang sau"
              className="pointer-events-none opacity-40"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
