import { create } from "zustand";
import { useToastStore } from "../ui/toastStore";

type State = {
  loading: boolean;
  error: string | null;
  login: () => void;
  loggedIn: boolean;
  isSyncOn: boolean;
  turnOnSync: () => void;
  verifyToken: () => void;
};

export const useCloudStore = create<State>((set) => ({
  loading: false,
  loggedIn: false,
  error: null,
  isSyncOn: localStorage.getItem("isSyncOn") === "true",

  login: async () => {
    set({ loading: true, error: null });
    try {
      const res = await window.context.login();
      console.log(res);
      if (res.success) {
        set({ isSyncOn: true, loggedIn: true, loading: false });

        useToastStore.getState().toast("sync", res.message, "success");
        localStorage.setItem("isSyncOn", "true");
      } else {
        set({ error: res.message, loading: false });
        useToastStore.getState().toast("sync", res.message, "error");
      }
    } catch (err: any) {
      set({ loading: true, error: null });
      set({ error: err.message || "Failed to login", loading: false });
    }
  },

  turnOnSync: async () => {
    set({ loading: true, error: null });
    try {
      const res = await window.context.uploadToDrive();
      console.log(res);
      if (res.success) {
        set({ isSyncOn: true, loading: false });
        useToastStore.getState().toast("sync", res.message, "success");
        localStorage.setItem("isSyncOn", "true");
      } else {
        set({ error: res.message, loading: false });
        useToastStore.getState().toast("sync", res.message, "error");
      }
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
        set({ loading: false, loggedIn: true });
        console.log(res.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  }
}));
