import { create } from "zustand"

type State = {
  openToastId: string
  isAnimating: boolean
  toastContent: string
  status: string
  toast: (id: string, content: string, status: string) => void
  closeToast: () => void
}

export const useToastStore = create<State>((set, get) => ({
  openToastId: "",
  isAnimating: false,
  toastContent: "",
  status: "",

  toast: (id, content, status) => {
    const showToast = () => {
      set({ status })
      set({ openToastId: id })
      set({ toastContent: content })
      setTimeout(() => {
        if (get().openToastId === id) get().closeToast()
      }, 3000)
    }

    if (get().openToastId === id) return
    showToast()
  },

  closeToast: () => {
    set({ isAnimating: true })
    setTimeout(() => {
      set({ isAnimating: false })
      set({ openToastId: "" })
    }, 200)
  }
}))
