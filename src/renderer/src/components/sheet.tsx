import { action } from "@/lib/constants"
import AddCustomer from "@/pages/customer/AddCustomer"
import EditCustomer from "@/pages/customer/EditCustomer"
import AddProduct from "@/pages/product/AddProduct"
import EditProduct from "@/pages/product/EditProduct"
import AddSupplier from "@/pages/supplier/AddSupplier"
import EditSupplier from "@/pages/supplier/EditSupplier"
import { useSheetStore } from "@/store"
import style from "./css/sheet.module.css"

function Sheet() {
  const { openSheetId, sheetProps } = useSheetStore()

  if (!openSheetId) return null

  return (
    <Template>
      {
        {
          [action.customer.create]: <AddCustomer />,
          [action.customer.edit]: <EditCustomer sheetProps={sheetProps} />,
          [action.product.create]: <AddProduct />,
          [action.product.edit]: <EditProduct sheetProps={sheetProps} />,
          [action.customer.edit]: <EditCustomer sheetProps={sheetProps} />,
          [action.supplier.create]: <AddSupplier />,
          [action.supplier.edit]: <EditSupplier sheetProps={sheetProps} />
        }[openSheetId]
      }
    </Template>
  )
}
export default Sheet

type Props = {
  children: React.ReactNode
}

function Template({ children }: Props) {
  const { openSheetId, isClosing, closeSheet } = useSheetStore()

  if (!openSheetId && !isClosing) return null
  return (
    <div
      className={`fixed inset-0 z-10 flex cursor-default justify-end bg-gray-500/10 p-2 ${openSheetId && style.show_sheet} ${isClosing && style.hide_sheet}`}
      onMouseDown={closeSheet}
      // onContextMenu={(e) => e.stopPropagation()}
    >
      <div
        className={`w-[500px] overflow-y-auto overscroll-contain rounded-lg bg-white p-8 shadow-md ${openSheetId && style.wraper_show} ${isClosing && style.wraper_hide}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
