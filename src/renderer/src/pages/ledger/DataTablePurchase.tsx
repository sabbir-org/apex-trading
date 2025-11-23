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
import { useModalStore, useSaleStore } from "@/store"
import { TPurchase } from "@shared/models"
import { useState } from "react"

interface DataTableProps<Sale extends TPurchase, TValue> {
  columns: ColumnDef<Sale, TValue>[]
  data: Sale[]
}

export function DataTablePurchase<Sale extends TPurchase, TValue>({
  columns,
  data
}: DataTableProps<Sale, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const menuHook = useMenu()
  const [sale, setSale] = useState<TPurchase | null>(null)

  const handleRowRightClick = (event: React.MouseEvent, purchase: TPurchase | TPurchase) => {
    setSale(purchase)
    menuHook.openMenu(purchase.id, event, { x: event.clientX, y: event.clientY })
  }

  const handleShowDeleteOption = () => {
    useModalStore.getState().openModal(action.purchase.delete, {
      sale,
      handlerFun: useSaleStore.getState().undoSale
    })
    menuHook.closeMenu()
  }

  return (
    <div className="rounded-md border">
      {menuHook.openMenuId === sale?.id && (
        <Menu hook={menuHook}>
          <button
            className={`h-8 rounded hover:bg-gray-100`}
            onClick={() => handleShowDeleteOption()}
          >
            Delete
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
