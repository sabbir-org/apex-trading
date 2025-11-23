import { action } from "@/lib/constants"
import { wordFilter } from "@/lib/utils"
import { useModalStore, useSheetStore } from "@/store"
import { TCustomer, TSupplier } from "@shared/models"
import { Search } from "lucide-react"
import { useState } from "react"

const SearchUser = ({ props }) => {
  const { storedUsers, setUser, userType } = props
  const [filteredItems, setFilteredItems] = useState<(TCustomer | TSupplier)[]>(storedUsers)

  const handleSearchLogic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const filtered = storedUsers.filter((item) => wordFilter(item.name, value))
    setFilteredItems(filtered)
  }

  const handleSelectUser = (item: TCustomer | TSupplier) => {
    setUser(userType, item)
    useModalStore.getState().closeModal()
  }

  const handleAddNewUser = () => {
    useModalStore.getState().closeModal()
    if (userType === "customer") useSheetStore.getState().openSheet(action.customer.create)
    else useSheetStore.getState().openSheet(action.supplier.create)
  }

  return (
    <div className={`h-[350px] w-[450px]`}>
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

      <button
        className={`absolute top-2 right-2 h-8 w-[100px] cursor-pointer rounded border border-blue-300 text-blue-600`}
        onClick={handleAddNewUser}
      >
        New
      </button>

      <div className={`mt-2`}>
        <p className={`mb-2 text-gray-400`}>suggestions</p>
        <div className={`grid h-[274px] grid-cols-2 gap-x-2 overflow-y-auto`}>
          {filteredItems?.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => handleSelectUser(item)}
                className={`h-fit rounded bg-gray-100 px-2 py-1 hover:bg-blue-100 hover:text-blue-800`}
              >
                {item.name} - {item.identifier} - {item.address}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SearchUser
