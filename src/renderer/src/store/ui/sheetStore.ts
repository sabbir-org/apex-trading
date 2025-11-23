import { create } from "zustand"

type State = {
  openSheetId: string | null
  sheetProps: Record<string, any> | null
  isClosing: boolean
  openSheet: (id: string, args?: any) => void
  closeSheet: () => void
}

export const useSheetStore = create<State>((set) => ({
  openSheetId: null,
  isClosing: false,
  sheetProps: null,
  openSheet: (id, props) => {
    set({ openSheetId: id, sheetProps: props })
  },

  closeSheet: () => {
    set({ isClosing: true })
    setTimeout(() => {
      set({ openSheetId: null })
      set({ isClosing: false })
    }, 200)
  }
}))
