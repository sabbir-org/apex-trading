import { wordFilter } from "@/lib/utils"
import { useModalStore, usePurchaseStore } from "@/store"
import { TProduct } from "@shared/models"
import clsx from "clsx"
import { Check, Search } from "lucide-react"
import { useState } from "react"

const Cart = ({ props }) => {
  const { storedItems, setProducts } = props
  const [filteredItems, setFilteredItems] = useState<TProduct[]>(storedItems)
  const { cart, updateCart, updateCartValue, clearCart } = usePurchaseStore()

  const handleSearchLogic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const filtered = storedItems.filter((item) => wordFilter(item.name, value))
    setFilteredItems(filtered)
  }

  const handleConfirm = () => {
    setProducts("products", cart)
    useModalStore.getState().closeModal()
  }

  return (
    <div className={`min-h-[600px] w-[800px]`}>
      <div
        className={`relative flex h-8 w-[200px] items-center rounded border border-gray-300 px-2 focus-within:border-blue-300 focus-within:bg-blue-50/30`}
      >
        <Search className={`absolute top-2 left-2 h-4 w-4 text-gray-500`}></Search>
        <input
          type="text"
          className={`ml-5 w-full outline-none`}
          placeholder="search..."
          onChange={handleSearchLogic}
        />
      </div>

      <div className={`mt-2`}>
        <p className={`mb-2 text-gray-400`}>suggestions</p>
        <div className={`h-[480px] overflow-y-auto rounded border`}>
          <div className={`grid h-8 grid-cols-8 items-center gap-x-2 border-b bg-gray-50 px-2`}>
            <p className={`col-span-2 font-medium`}>Name</p>
            <p className={`font-medium`}>Brand</p>
            <p className={`font-medium`}>Size</p>
            <p className={`font-medium`}>Unit</p>
            <p className={`font-medium`}>Quantity</p>
            <p className={`font-medium`}>Rate</p>
            <p className={`font-medium`}>Total Cost</p>
          </div>

          {filteredItems?.map((item) => {
            return (
              <div
                key={item.id}
                className={`mb-1 grid h-8 grid-cols-8 items-center gap-x-2 rounded px-2 hover:bg-gray-100`}
                onClick={() => updateCart(item)}
              >
                <p className={`col-span-2 flex items-center gap-x-2`}>
                  {cart?.find((prod) => prod.productId === item.id) ? (
                    <Check
                      className={`h-[13px] w-[13px] rounded border border-blue-300 bg-blue-500 text-white`}
                    ></Check>
                  ) : (
                    <span
                      className={`block h-[13px] w-[13px] rounded border border-gray-600`}
                    ></span>
                  )}

                  {item.name}
                </p>
                <p>{item.brand}</p>
                <p>{item.size}</p>
                <p> {item.unit}</p>
                {cart.find((prod) => prod.productId === item.id) ? (
                  <>
                    <input
                      className={clsx(
                        `h-8 border-b border-gray-300 outline-none focus:border-blue-600 focus:bg-blue-50/30`
                      )}
                      onClick={(e) => e.stopPropagation()}
                      type="text"
                      placeholder={"0"}
                      onChange={(e) => updateCartValue(item, "quantity", Number(e.target.value))}
                    />
                    <input
                      className={clsx(
                        `h-8 border-b border-gray-300 outline-none focus:border-blue-300 focus:bg-blue-50/30`
                      )}
                      type="text"
                      placeholder={"0"}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateCartValue(item, "rate", Number(e.target.value))}
                    />
                  </>
                ) : (
                  <>
                    <p>0</p>
                    <p>0</p>
                  </>
                )}

                <p>
                  {(() => {
                    const product = cart.find((prod) => prod.productId === item.id)
                    return product ? product.quantity * product.rate : 0
                  })()}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`mt-4 flex justify-between space-x-2`}>
        <button className={`cursor-pointer text-blue-600 underline`} onClick={clearCart}>
          Reset
        </button>
        <button
          className={`h-8 w-[150px] cursor-pointer rounded border border-blue-400 font-medium text-blue-600`}
          onClick={handleConfirm}
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default Cart
