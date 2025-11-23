import { useModalStore } from "@/store"
import { Trash2 } from "lucide-react"

const DeleteSale = ({ props }) => {
  const handleAction = () => {
    props.handlerFun(props.dataToDel)
    useModalStore.getState().closeModal()
  }
  return (
    <div className={`flex w-[450px] flex-col items-center pt-8 pb-4`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-red-50`}>
        <Trash2 className={`text-red-600`}></Trash2>
      </div>
      <h2 className={`mt-2 text-lg font-medium`}>Delete Sale?</h2>
      <p className={`mt-2 w-[70%] text-center`}>
        This will delete the sale and undo the related additions.
      </p>
      <button
        className={`mt-4 h-8 w-[100px] cursor-pointer rounded border border-blue-400 text-blue-600 outline-none`}
        onClick={handleAction}
      >
        Ok
      </button>
    </div>
  )
}

export default DeleteSale
