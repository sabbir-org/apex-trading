import { useModalStore } from "@/store"
import { Trash2 } from "lucide-react"

type Props = {
  data: any
  onConfirm: any
  title?: string
  description?: string
}

const Confirm = ({ data, onConfirm, title, description }: Props) => {
  const handleConfirm = () => {
    onConfirm(data)
    useModalStore.getState().closeModal()
  }

  return (
    <div
      className={`flex h-[200px] w-[340px] flex-col justify-between rounded-md border bg-white p-1.5 shadow shadow-gray-200`}
    >
      <Trash2 className={`mx-auto mt-4 w-fit text-blue-600`}></Trash2>

      <div>
        <p className={`mt-4 px-4 text-center font-semibold text-gray-800`}>{title}</p>
        <p className={`mt-4 px-4 text-center text-gray-500`}>{description}</p>
      </div>

      <button
        className={`mt-4 w-full rounded bg-blue-600 py-1.5 font-medium text-white`}
        onClick={handleConfirm}
      >
        confirm
      </button>
    </div>
  )
}
export default Confirm
