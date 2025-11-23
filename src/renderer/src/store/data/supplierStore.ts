import { useToastStore } from "@/store"
import { TSupplier } from "@shared/models"
import { create } from "zustand"

type State = {
  suppliers: TSupplier[]
  loading: boolean
  error: string | null
  selectedIds: string[]
  fetchSuppliers: () => Promise<void>
  updateSupplier: (supplier: TSupplier) => Promise<void>
  getSupplierDetails: (id: string) => TSupplier | undefined
}

export const useSupplierStore = create<State>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,
  selectedIds: [],
  fetchSuppliers: async () => {
    set({ loading: true, error: null })
    try {
      const suppliers = await window.context.getSuppliers()
      set({ suppliers, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load suppliers", loading: false })
    }
  },

  updateSupplier: async (supplier) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateSupplier(supplier)
      if (res.success) {
        await get().fetchSuppliers()
        useToastStore.getState().toast("updatesupplier", res.message, "success")
      } else {
        set({ error: "Failed to add supplier" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to add supplier" })
    } finally {
      set({ loading: false })
    }
  },

  getSupplierDetails: (id) => get().suppliers.find((supplier) => supplier.id === id)
}))
