import { useToastStore } from "@/store"
import { TCustomer } from "@shared/models"
import { create } from "zustand"

type State = {
  customers: TCustomer[]
  loading: boolean
  error: string | null
  selectedIds: string[]
  fetchCustomers: () => Promise<void>
  updateCustomer: (customer: TCustomer) => Promise<void>
  getCustomerDetails: (id: string) => TCustomer
  updateField: (id: string, key: string, value: any) => Promise<void>
}

export const useCustomerStore = create<State>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  selectedIds: [],
  fetchCustomers: async () => {
    set({ loading: true, error: null })
    try {
      const customers = await window.context.getCustomers()
      set({ customers, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load customers", loading: false })
    }
  },

  updateCustomer: async (customer) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateCustomer(customer)
      if (res.success) {
        await get().fetchCustomers()
        useToastStore.getState().toast("updatecustomer", res.message, "success")
      } else {
        set({ error: "Failed to add customer" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to add customer" })
    } finally {
      set({ loading: false })
    }
  },

  updateField: async (id: string, key: string, value: string) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateCustomerField(id, key, value)
    } catch (err: any) {
      set({ error: err.message || "failed" })
    }
  },

  getCustomerDetails: (id) =>
    get().customers.find((customer) => customer.id === id) || ({} as TCustomer)
}))
