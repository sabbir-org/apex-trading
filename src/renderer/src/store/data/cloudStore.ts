import { create } from "zustand";
import { useToastStore } from "../ui/toastStore";

type State = {
  loading: boolean;
  error: string | null;
  user: any;
  syncFile: () => void;
  verifyToken: () => void;
};

export const useCloudStore = create<State>((set) => ({
  loading: false,
  user: null,
  error: null,

  syncFile: async () => {
    set({ loading: true, error: null });
    try {
      const veriRes = await window.context.verify();

      if (!veriRes.success) {
        set({ loading: false });
        useToastStore.getState().toast("sync", veriRes.message, "error");
        return;
      }

      set({ user: veriRes.data });
      const readRes = await window.context.readFromDrive();

      if (readRes.success) {
        useToastStore.getState().toast("sync", readRes.message, "success");
      } else {
        const upRes = await window.context.uploadToDrive();
        if (upRes.success) {
          useToastStore.getState().toast("sync", upRes.message, "success");
        } else {
          useToastStore.getState().toast("sync", upRes.message, "error");
        }
      }
      set({ loading: false });
    } catch (err: any) {
      set({ loading: true, error: null });
      set({ error: err.message || "Failed to sync", loading: false });
    }
  },

  verifyToken: async () => {
    set({ loading: true, error: null });
    try {
      const res = await window.context.verify();
      if (res.success) {
        set({ loading: false, user: res.data });
        console.log(res.data);
      } else {
        set({ loading: false, error: res.message });
        console.log(res.data);
        useToastStore.getState().toast("sync", res.message, "error");
      }
    } catch (err: any) {
      console.log(err);
    }
  }
}));
