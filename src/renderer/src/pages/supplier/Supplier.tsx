import { TopBar } from "@/components"
import { action } from "@/lib/constants"
import { bdt } from "@/lib/utils"
import { useSheetStore, useSupplierStore } from "@/store"
import { TSupplier } from "@shared/models"
import { ColumnDef } from "@tanstack/react-table"
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"

const columns: ColumnDef<TSupplier>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: ({ name, identifier }) => name + "-" + identifier
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "phone",
    header: "Phone"
  },
  {
    id: "totalSale",
    header: "Total Sale",
    accessorFn: ({ totalSale }) => bdt(totalSale)
  },
  {
    id: "totalPaid",
    header: "Total Paid",
    accessorFn: ({ totalPaid }) => bdt(totalPaid)
  },
  {
    id: "totalDue",
    header: "Total Due",
    accessorFn: ({ totalSale, totalPaid }) => bdt(totalSale - totalPaid)
  },
  {
    accessorKey: "lastSale",
    header: "Last Sale"
  }
]

const Supplier = () => {
  const { suppliers, selectedIds } = useSupplierStore()
  const { openSheet } = useSheetStore()
  const [filteredSuppliers, setFilteredSuppliers] = useState<TSupplier[]>([])
  const multiSelected = selectedIds.length > 0

  useEffect(() => {
    setFilteredSuppliers(suppliers)
  }, [suppliers])

  function handleAddSupplier() {
    openSheet(action.supplier.create)
  }

  return (
    <>
      <TopBar>
        {!multiSelected && (
          <button
            onClick={handleAddSupplier}
            className={`flex h-full items-center gap-x-2 border-r px-4 hover:bg-gray-100`}
          >
            <CirclePlus size={18} className={`text-blue-600`}></CirclePlus>
            <span className={`mt-0.5`}>Add New Supplier</span>
          </button>
        )}
      </TopBar>

      <DataTable columns={columns} data={filteredSuppliers} />
    </>
  )
}
export default Supplier
