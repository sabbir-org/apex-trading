import { TopBar } from "@/components"
import { action } from "@/lib/constants"
import { bdt } from "@/lib/utils"
import { useCustomerStore, useSheetStore } from "@/store"
import { TCustomer } from "@shared/models"
import { ColumnDef } from "@tanstack/react-table"
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"

const columns: ColumnDef<TCustomer>[] = [
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
    header: "phone"
  },
  {
    id: "totalPurchase",
    header: "Total Purchase",
    accessorFn: ({ totalPurchase }) => bdt(totalPurchase)
  },
  {
    id: "totalPaid",
    header: "Total Paid",
    accessorFn: ({ totalPaid }) => bdt(totalPaid)
  },
  {
    id: "totalDue",
    header: "Total Due",
    accessorFn: ({ totalPurchase, totalPaid }) => bdt(totalPurchase - totalPaid)
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase"
  }
]

const Customer = () => {
  const { customers, selectedIds } = useCustomerStore()
  const { openSheet } = useSheetStore()
  const [filteredCustomers, setFilteredCustomers] = useState<TCustomer[]>([])
  const multiSelected = selectedIds.length > 0

  useEffect(() => {
    setFilteredCustomers(customers)
  }, [customers])

  function handleAddCustomer() {
    openSheet(action.customer.create)
  }

  return (
    <>
      <TopBar>
        {!multiSelected && (
          <button
            onClick={handleAddCustomer}
            className={`flex h-full items-center gap-x-2 border-r px-4 hover:bg-gray-100`}
          >
            <CirclePlus size={18} className={`text-blue-600`}></CirclePlus>
            <span className={`mt-0.5`}>Add New Customer</span>
          </button>
        )}
      </TopBar>

      <DataTable columns={columns} data={filteredCustomers} />
    </>
  )
}
export default Customer
