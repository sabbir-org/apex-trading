import { create } from "zustand"

type State = {
  showOptionId: string | null
  isClosing: boolean
  position: { x: number; y: number }
  showOption: (id: string) => void
  hideOption: () => void
}

export const useOptionStore = create<State>((set) => ({
  showOptionId: null,
  isClosing: false,
  position: { x: 0, y: 0 },

  showOption: (id) => {
    set({ showOptionId: id })
  },

  hideOption: () => {
    set({ isClosing: true })
    setTimeout(() => {
      set({ showOptionId: null })
      set({ isClosing: false })
    }, 200)
  }
}))
