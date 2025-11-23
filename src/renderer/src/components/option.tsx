import { useOptionStore } from "@/store/ui/optionStore"
import style from "./css/menu.module.css"
type Props = {
  options: any
  setSelected: any
}

const Option: React.FC<Props> = ({ options, setSelected }) => {
  const { showOptionId, isClosing } = useOptionStore()
  const handleOptionClick = (option : any) => {
    setSelected("customer", option)
    useOptionStore.getState().hideOption()
  }
  return (
    <>
      {showOptionId && (
        <div
          className={`absolute z-10 mt-2 flex max-h-[200px] w-[calc(100%-4rem)] flex-col overflow-y-auto rounded border bg-white p-1.5 shadow-md shadow-gray-200 ${showOptionId && style.show} ${isClosing && style.hide}`}
        >
          {options.map((option) => (
            <span
              key={option.id}
              className={`w-full rounded px-2 py-1.5 hover:bg-gray-100`}
              onClick={() => handleOptionClick(option)}
            >
              {option.name + " " + option.identifier || ""}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

export default Option
