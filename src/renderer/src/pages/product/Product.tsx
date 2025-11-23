import { TopBar } from "@/components"
import { action } from "@/lib/constants"
import { bdt } from "@/lib/utils"
import { useProductStore, useSheetStore } from "@/store"
import { TProduct } from "@shared/models"
import { ColumnDef } from "@tanstack/react-table"
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"

const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: "id",
    header: "Product ID"
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "brand",
    header: "Brand"
  },
  {
    accessorKey: "quantity",
    header: "Quantity"
  },
  {
    accessorKey: "size",
    header: "Size"
  },
  {
    accessorKey: "unit",
    header: "Unit"
  },
  {
    id: "rate",
    header: "Price",
    accessorFn: ({ rate }) => bdt(rate || 0)
  }
]

const Product = () => {
  const { products, selectedIds } = useProductStore()
  const { openSheet } = useSheetStore()
  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
  const multiSelected = selectedIds.length > 0

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  function handleAddProduct() {
    openSheet(action.product.create)
  }

  return (
    <>
      <TopBar>
        {!multiSelected && (
          <button
            onClick={handleAddProduct}
            className={`flex h-full items-center gap-x-2 border-r px-4 hover:bg-gray-100`}
          >
            <CirclePlus size={18} className={`text-blue-600`}></CirclePlus>
            <span className={`mt-0.5`}>Add New Product</span>
          </button>
        )}
      </TopBar>
      <DataTable columns={columns} data={filteredProducts} />
    </>
  )
}
export default Product
