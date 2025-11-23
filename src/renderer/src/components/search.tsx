import { wordFilter } from "@/lib/utils"
import { useOptionStore } from "@/store/ui/optionStore"
import { twMerge } from "tailwind-merge"
import Option from "./option"

type Props = {
  storeItems: any
  filteredItems: any
  setFilteredItems: any
  setSelected: any
  className?: string
}

const Search = ({ storeItems, filteredItems, setFilteredItems, setSelected, className }: Props) => {
  const handleSearchLogic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      useOptionStore.getState().hideOption()
      return
    }
    const filtered = storeItems.filter((item) => wordFilter(item.name, value))
    setFilteredItems(filtered)
    if (filtered.length > 0) useOptionStore.getState().showOption("show")
  }

  return (
    <div>
      <input
        type="text"
        className={twMerge(
          `block h-9 w-full rounded border px-2 shadow-gray-200 outline-none focus:border-blue-300 focus:bg-blue-50/30`,
          className
        )}
        placeholder="Search..."
        onChange={handleSearchLogic}
      />
      <Option options={filteredItems} setSelected={setSelected}></Option>
    </div>
  )
}
export default Search
