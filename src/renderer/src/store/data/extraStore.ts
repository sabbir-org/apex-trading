import { TExpense } from "@shared/models"
import { create } from "zustand"
import { useCustomerStore } from "./customerStore"
import { useProductStore } from "./productStore"
import { usePurchaseStore } from "./purchaseStore"
import { useSaleStore } from "./saleStore"
import { useSupplierStore } from "./supplierStore"

type State = {
  expenses: TExpense[]
  expensesToday: TExpense[]
  loading: boolean
  error: string | null
  fetchExpenses: () => Promise<void>
  updateExpense: (expense: TExpense) => Promise<void>
  fetchAll: () => Promise<void>
}

export const useExtraStore = create<State>((set, get) => ({
  expenses: [],
  expensesToday: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true, error: null })
    try {
      const expenses = await window.context.getExpenses()
      set({
        expensesToday: expenses?.filter((exp) => exp.date === new Date().toLocaleDateString())
      })
      set({ expenses, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load expenses", loading: false })
    }
  },

  updateExpense: async (expense: TExpense) => {
    const res = await window.context.updateExpense(expense)
    if (res.success) {
      await get().fetchExpenses()
    }
  },

  fetchAll: async () => {
    await get().fetchExpenses()
    await useCustomerStore.getState().fetchCustomers()
    await useSupplierStore.getState().fetchSuppliers()
    await useProductStore.getState().fetchProducts()
    await useSaleStore.getState().fetchSales()
    await usePurchaseStore.getState().fetchPurchases()
  }
}))
