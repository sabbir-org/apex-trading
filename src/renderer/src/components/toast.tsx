import { useEffect, useRef, useState } from "react"

import { useToastStore } from "@/store"
import { CheckCircle, CircleX } from "lucide-react"
import style from "./css/toast.module.css"

type Props = {}

export const Toast = ({}: Props) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const { openToastId, isAnimating, toastContent, status } = useToastStore()

  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(modalRef.current?.offsetWidth || 0)
    const interval = setInterval(() => {
      setWidth((prev) => Number((prev - 0.35).toFixed(1)))
    }, 1)

    return () => clearInterval(interval)
  }, [openToastId])

  if (!openToastId && !isAnimating) return null

  return (
    <div
      ref={modalRef}
      className={`fixed right-8 bottom-6 z-20 flex min-h-12 w-[250px] items-center gap-x-3 rounded border bg-white px-4 py-2 shadow ${openToastId && style.show_toast} ${isAnimating && style.hide_toast}`}
      onContextMenu={(e) => e.stopPropagation()}
    >
      {status === "error" ? (
        <CircleX size={18} className={`text-red-600`} />
      ) : status === "success" ? (
        <CheckCircle size={18} className={`text-blue-600`} />
      ) : null}
      <span className={`text-gray-600`}>{toastContent}</span>
      <div
        className={`absolute bottom-0 left-0 h-[2px] ${status === "error" ? "bg-red-600" : "bg-blue-600"} bg-blue-600`}
        style={{ width: width <= 0 ? 0 : width }}
      ></div>
    </div>
  )
}
