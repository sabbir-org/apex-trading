import { create } from "zustand"

type State = {
  openMenuId: string | null
  isAnimating: boolean
  position: { x: number; y: number }

  openMenu: (id: string, clientPosition?: { x: number; y: number }) => void
  closeMenu: () => void
  updatePosition: (clientPosition: { x: number; y: number }) => void
}

export const useMenuStore = create<State>((set) => ({
  openMenuId: null,
  isAnimating: false,
  position: { x: 0, y: 0 },

  updatePosition: (clientPosition) => set({ position: clientPosition }),

  openMenu: (id, clientPosition) => {
    set({ openMenuId: id })
    set({ position: clientPosition || { x: 0, y: 0 } })
  },

  closeMenu: () => {
    set({ isAnimating: true })
    setTimeout(() => {
      set({ openMenuId: null })
      set({ isAnimating: false })
    }, 200)
  }
}))
