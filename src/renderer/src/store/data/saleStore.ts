import { useExtraStore, useToastStore } from "@/store"
import { TProduct, TSale, TSaleProduct } from "@shared/models"
import { create } from "zustand"

interface State {
  sales: TSale[]
  loading: boolean
  error: string | null
  cart: TSaleProduct[]
  getLastId: () => string
  fetchSales: () => Promise<void>
  updateSale: (sale: TSale) => Promise<void>
  undoSale: (sale: TSale) => Promise<void>
  updateCart: (item: TProduct) => void
  updateCartValue: (item: TProduct, key: string, value: number) => void
  clearCart: () => void
}

export const useSaleStore = create<State>((set, get) => ({
  loading: false,
  error: null,
  sales: [],
  cart: [],

  fetchSales: async () => {
    set({ loading: true, error: null })
    try {
      const sales = await window.context.getSales()
      set({ sales, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load sales", loading: false })
    }
  },

  getLastId: () => {
    try {
      const lastId = get().sales[get().sales.length - 1].id
      return lastId
    } catch (err: any) {
      return "P000"
    }
  },

  updateCart: (item) => {
    const found = get().cart.find((prod) => prod.productId === item.id)

    if (found) {
      set({
        cart: get().cart.filter((prod) => prod.productId !== item.id)
      })
    } else {
      set({
        cart: [
          ...get().cart,
          {
            name: item.name,
            brand: item.brand,
            size: item.size,
            unit: item.unit,
            productId: item.id,
            buyRate: item.rate,
            quantity: 0,
            rate: 0
          }
        ]
      })
    }
  },

  updateCartValue: (item, key, value) => {
    set({
      cart: get().cart.map((prod) => {
        if (prod.productId === item.id) {
          return { ...prod, [key]: value }
        }
        return prod
      })
    })
  },

  clearCart: () => set({ cart: [] }),

  updateSale: async (sale) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateSale(sale)
      if (res.success) {
        await useExtraStore.getState().fetchAll()
        useToastStore.getState().toast("newsale", "sale added", "success")
      } else {
        set({ error: "Failed to add sale" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to add sale" })
    } finally {
      set({ loading: false })
    }
  },

  undoSale: async (sale) => {
    try {
      const res = await window.context.undoSale(sale)
      if (res.success) {
        await useExtraStore.getState().fetchAll()
        useToastStore.getState().toast("undosale", "sale removed", "success")
      } else {
        set({ error: "Failed to remove sale" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to remove sale" })
    } finally {
      set({ loading: false })
    }
  }
}))
