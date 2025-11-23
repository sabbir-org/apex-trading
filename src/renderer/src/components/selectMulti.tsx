import { Check } from 'lucide-react'

type Props = {
  item: any
  checkedItems: any[]
  onSelect: (item: any, stockOut: boolean) => void
}

function SelectMulti({ item, checkedItems, onSelect }: Props) {
  const isSelected = checkedItems.find((i) => i.id === item.id)
  const stockOut = item.stock.quantity === 0

  return (
    <div
      className={`flex h-8 items-center justify-between gap-x-2 space-x-2 rounded border px-2 ${isSelected && 'border-blue-300 bg-blue-50/30'} ${stockOut && 'text-gray-400'}`}
      onClick={() => onSelect(item, stockOut)}
    >
      <span>
        {isSelected ? (
          <Check className={`h-[13px] w-[13px] rounded-[2px] bg-blue-600 text-white`}></Check>
        ) : (
          <span className={`block h-[13px] w-[13px] rounded-[2px] border border-gray-400`}></span>
        )}
      </span>
      <span className={`w-[96%]`}>{item.name}</span>
      {/* <span className={`w-[20%]`}>{getCurrency(Number(item.price))}</span> */}
      {/* <span className={`w-[10%]`}>{item.stock.quantity}</span> */}
    </div>
  )
}
export default SelectMulti
