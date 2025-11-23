import { Subtitle } from "@/components/typography"
import { bdt } from "@/lib/utils"
import { usePurchaseStore, useSaleStore } from "@/store"
import { TPurchase, TSale } from "@shared/models"
import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { DataTablePurchase } from "./DataTablePurchase"
import { DataTableSale } from "./DataTableSale"

const columnsSale: ColumnDef<TSale>[] = [
  {
    accessorKey: "billNum",
    header: "Bill Number"
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "billingDate",
    header: "Billing Date"
  },
  {
    id: "billAmount",
    header: "Bill Amount",
    accessorFn: ({ billAmount }) => bdt(billAmount)
  },
  {
    id: "paid",
    header: "Paid",
    accessorFn: ({ paid }) => bdt(paid)
  },
  {
    id: "profit",
    header: "Profit",
    accessorFn: (row) => {
      const { products } = row
      if (!products) return
      const profit = products.reduce(
        (acc, curr) => acc + (curr.rate - curr.buyRate) * curr.quantity,
        0
      )
      return bdt(Number(profit.toFixed(2)))
    }
  }
]

const columnsPurchase: ColumnDef<TPurchase>[] = [
  {
    accessorKey: "billNum",
    header: "Bill Number"
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "billingDate",
    header: "Billing Date"
  },
  {
    id: "billAmount",
    header: "Bill Amount",
    accessorFn: ({ billAmount }) => bdt(billAmount)
  },
  {
    id: "paid",
    header: "Paid",
    accessorFn: ({ paid }) => bdt(paid)
  }
]

const Ledger = () => {
  const { sales } = useSaleStore()
  const { purchases } = usePurchaseStore()
  const [filteredSales, setFilteredSales] = useState<TSale[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<TPurchase[]>([])

  useEffect(() => {
    setFilteredSales(sales)
  }, [sales])
  
  useEffect(() => {
    setFilteredPurchases(purchases)
  }, [purchases])

  return (
    <>
      <Subtitle>Sale</Subtitle>
      <DataTableSale columns={columnsSale} data={filteredSales} />
      <Subtitle className={`mt-4`}>Purchase</Subtitle>
      <DataTablePurchase columns={columnsPurchase} data={filteredPurchases} />
    </>
  )
}
export default Ledger
