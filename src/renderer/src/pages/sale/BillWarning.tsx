import { useModalStore } from "@/store"
import { TriangleAlert } from "lucide-react"

const BillWarning = ({ props }) => {
  const handleAction = () => {
    useModalStore.getState().closeModal()
    props.printInvoice()
  }
  return (
    <div className={`flex w-[450px] flex-col items-center pt-8 pb-4`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-orange-50`}>
        <TriangleAlert fill="#ffb40c" stroke="white"></TriangleAlert>
      </div>
      <h2 className={`mt-2 text-lg font-medium`}>Bypass Bill?</h2>
      <p className={`mt-2 w-[70%] text-center`}>
        This will allow you to bypass bill creation and skip to invoice print.
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

export default BillWarning
