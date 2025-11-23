import { useToastStore } from "@/store"
import { TProduct, TSaleProduct } from "@shared/models"
import { create } from "zustand"

interface State {
  products: TProduct[]
  loading: boolean
  error: string | null
  selectedIds: string[]
  fetchProducts: () => Promise<void>
  getProductDetails: (id: string) => TProduct | undefined
  getLastId: () => string
  updateProduct: (product: TProduct) => Promise<void>
  updateField: (id: string, key: string, value: any) => Promise<void>
  restock: (data: { id: string; quantity: number; cost: number }) => Promise<void>
  batchReduceQuantity: (data: TSaleProduct[]) => Promise<void>
}

export const useProductStore = create<State>((set, get) => ({
  loading: false,
  error: null,
  products: [],
  selectedIds: [],

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const products = await window.context.getProducts()
      set({ products, loading: false })
    } catch (err: any) {
      set({ error: err.message || "Failed to load products", loading: false })
    }
  },

  getProductDetails: (id) => {
    return get().products.find((product) => product.id === id)
  },

  getLastId: () => {
    try {
      const lastId = get().products[get().products.length - 1].id
      return lastId
    } catch (err: any) {
      return "P000"
    }
  },

  updateProduct: async (product) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateProduct(product)
      if (res.success) {
        await get().fetchProducts()
        useToastStore.getState().toast("updateproduct", "product added", "success")
      } else {
        set({ error: "Failed to add product" })
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to add product" })
    } finally {
      set({ loading: false })
    }
  },

  updateField: async (id: string, key: string, value: string) => {
    set({ loading: true, error: null })
    try {
      const res = await window.context.updateProductField(id, key, value)
    } catch (err: any) {
      set({ error: err.message || "failed" })
    }
  },

  restock: async (data) => {
    try {
      const res = await window.context.restock(data)
      if (res.success) {
        await get().fetchProducts()
        useToastStore.getState().toast("stockcontrol", "stock updated", "success")
      }
    } catch (err: any) {
      if (err.message) {
        useToastStore.getState().toast("stockcontrol", err.message, "error")
      }
    }
  },

  batchReduceQuantity: async (products) => {
    try {
      const res = await Promise.all(products.map((item) => window.context.reduceQuantity(item)))
      if (res.every((item) => item.success)) {
        await get().fetchProducts()
        useToastStore.getState().toast("stockcontrol", "stock updated", "success")
      }
    } catch (err: any) {
      if (err.message) {
        useToastStore.getState().toast("stockcontrol", err.message, "error")
      }
    }
  }
}))
