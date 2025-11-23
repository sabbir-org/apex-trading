import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Menu } from "@/components/menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useMenu } from "@/hooks/useMenu"
import { action } from "@/lib/constants"
import { useModalStore } from "@/store"
import { TProduct } from "@shared/models"
import { useState } from "react"

interface DataTableProps<Product extends TProduct, TValue> {
  columns: ColumnDef<Product, TValue>[]
  data: Product[]
}

export function DataTable<Product extends TProduct, TValue>({
  columns,
  data
}: DataTableProps<Product, TValue>) {
  const { openModal } = useModalStore()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const menuHook = useMenu()
  const [selectedId, setSelectedId] = useState<string>("")

  function handleRowRightClick(event: React.MouseEvent, product: TProduct) {
    setSelectedId(product.id)
    menuHook.openMenu(product.id, event, { x: event.clientX, y: event.clientY })
  }

  function handleRestock() {
    openModal(action.product.stock, { productId: selectedId })
    menuHook.closeMenu()
  }

  return (
    <div className="mt-11 rounded-md border">
      {menuHook.openMenuId === selectedId && (
        <Menu hook={menuHook}>
          <button className={`h-8 rounded hover:bg-gray-100`} onClick={() => handleRestock()}>
            restock
          </button>
        </Menu>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onContextMenu={(e) => handleRowRightClick(e, row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
