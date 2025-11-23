import { Check } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type Props = {
  title: string
  checked: boolean
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function SelectSingle({ title, checked, setChecked, className }: Props) {
  function handleCheck() {
    setChecked((prev) => !prev)
  }

  return (
    <div
      className={twMerge(className, `flex h-8 items-center space-x-2 rounded`)}
      onClick={handleCheck}
    >
      <span>
        {checked ? (
          <Check className={`h-[13px] w-[13px] rounded-[2px] bg-blue-600 text-white`}></Check>
        ) : (
          <span className={`block h-[13px] w-[13px] rounded-[2px] border border-gray-400`}></span>
        )}
      </span>
      <span>{title}</span>
    </div>
  )
}
export default SelectSingle
