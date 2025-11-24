import { create } from "zustand";

type State = {
  openModalId: string | null;
  argProps: Record<string, any> | null;
  isClosing: boolean;
  openModal: (id: string, args?: any) => void;
  closeModal: () => void;
};

export const useModalStore = create<State>((set) => ({
  openModalId: null,
  isClosing: false,
  argProps: null,
  openModal: (id, args) => {
    set({ openModalId: id, argProps: args });
  },

  closeModal: () => {
    set({ isClosing: true });
    setTimeout(() => {
      set({ openModalId: null });
      set({ isClosing: false });
    }, 200);
  }
}));
