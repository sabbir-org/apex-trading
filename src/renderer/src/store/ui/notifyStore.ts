import { create } from "zustand";

type State = {
  notifyId: string | null;
  content: string;
  action?: {
    label: string;
    handler: () => void;
  };
  isAnimating: boolean;
  notify: (id: string, content: string, action?: any) => void;
  updateNotify: (content: string, label: string, handler: () => void) => void;
  close: () => void;
};

export const useNotifyStore = create<State>((set) => ({
  notifyId: null,
  isAnimating: false,
  content: "",

  notify: (id, content, action = null) => {
    action && set({ action });
    set({ notifyId: id, content });
  },

  updateNotify: (content, label, handler) => {
    set({ content, action: { label, handler } });
  },

  close: () => {
    set({ isAnimating: true });
    setTimeout(() => {
      set({ notifyId: null });
      set({ isAnimating: false });
    }, 200);
  }
}));
