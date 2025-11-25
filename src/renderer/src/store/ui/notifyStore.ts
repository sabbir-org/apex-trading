import { create } from "zustand";

type State = {
  notifyId: string | null;
  isAnimating: boolean;
  notify: (id: string) => void;
  close: () => void;
};

export const useNotifyStore = create<State>((set) => ({
  notifyId: null,
  isAnimating: false,
  content: "",

  notify: (id) => {
    set({ notifyId: id });
  },

  close: () => {
    set({ isAnimating: true });
    setTimeout(() => {
      set({ notifyId: null });
      set({ isAnimating: false });
    }, 200);
  }
}));
