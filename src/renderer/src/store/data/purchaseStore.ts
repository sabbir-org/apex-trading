import { useExtraStore, useToastStore } from "@/store"
import { TProduct, TPurchase, TPurchaseProduct } from "@shared/models"
import { create } from "zustand"

interface State {
  purchases: TPurchase[]
  loading: boolean
  error: string | null
  cart: TPurchaseProduct[]
  getLastId: () => string
  fetchPurchases: () => Promise<void>
  updatePurchase: (purchase: TPurchase) => Promise<void>
  updateCart: (cart: TProduct) => void
  updateCartValue: (item: TProduct, key: string, value: number) => void
  clearCart: () => void
}

export const usePurchaseStore = create<State>((set, get) => ({
  loading: false,
  error: null,
  purchases: [],
  cart: [],

  fetchPurchases: async () => {
    set({ loading: true, error: null })
    try {
      const purchases = await window.context.getPurchases()
      set({ purchases, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load sales", loading: false })
    }
  },

  getLastId: () => {
    try {
      const lastId = get().purchases[get().purchases.length - 1].id
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

  updatePurchase: async (purchase) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updatePurchase(purchase)
      if (res.success) {
        await useExtraStore.getState().fetchAll()
        useToastStore.getState().toast("newpurchase", "purchase added", "success")
      } else {
        set({ error: "Failed to add sale" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to add sale" })
    } finally {
      set({ loading: false })
    }
  }
}))
