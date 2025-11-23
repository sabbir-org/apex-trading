import { useMenu } from "@/hooks/useMenu"
import { Check } from "lucide-react"
import { Menu } from "./menu"

type Props = {
  placeholder: string
  options: string[]
  selectedOptions: string[]
  setSelectedOptions: any
  label: string
}

const Options: React.FC<Props> = ({
  placeholder,
  options,
  selectedOptions,
  setSelectedOptions,
  label
}) => {
  const useMenuHook = useMenu()

  const handleOptionClick = (item: string) => {
    if (selectedOptions.includes(item)) {
      setSelectedOptions(
        label,
        selectedOptions.filter((option) => option !== item)
      )
    } else {
      setSelectedOptions(label, [...selectedOptions, item])
    }
  }

  const handleTrigger = (e: React.MouseEvent) => {
    useMenuHook.openMenu(label, e, { x: e.clientX, y: e.clientY })
  }

  return (
    <div>
      <button
        type="button"
        className={`h-8 w-full rounded border px-2 text-left`}
        onClick={handleTrigger}
      >
        {selectedOptions.length === 0 ? (
          <p className={`text-neutral-400`}>{placeholder}</p>
        ) : (
          selectedOptions.map((option) => (
            <span className={`mr-1 rounded bg-gray-100 px-2 py-0.5`} key={option}>
              {option}
            </span>
          ))
        )}
      </button>

      {useMenuHook.openMenuId === label && (
        <Menu hook={useMenuHook}>
          {options.map((option) => (
            <span
              key={option}
              className={`flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100`}
              onClick={() => handleOptionClick(option)}
            >
              {option}

              {selectedOptions.includes(option) && <Check className={`h-[15px] w-[15px]`}></Check>}
            </span>
          ))}
        </Menu>
      )}
    </div>
  )
}

export default Options
