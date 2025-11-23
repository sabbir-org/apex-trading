import { create } from 'zustand'

type State = {
  openModalId: string | null
  modalProps: Record<string, any> | null
  isClosing: boolean
  openModal: (id: string, args?: any) => void
  closeModal: () => void
}

export const useModalStore = create<State>((set) => ({
  openModalId: null,
  isClosing: false,
  modalProps: null,
  openModal: (id, props) => {
    set({ openModalId: id, modalProps: props })
  },

  closeModal: () => {
    set({ isClosing: true })
    setTimeout(() => {
      set({ openModalId: null })
      set({ isClosing: false })
    }, 200)
  }
}))
