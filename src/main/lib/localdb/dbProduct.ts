import { TProduct, TSaleProduct } from "@shared/models"
import { getDataBase } from "./main";


export async function getProducts(): Promise<TProduct[]> {
  const db = await getDataBase()
  return db.data.products
}

export async function updateProduct(product: TProduct) {
  const db = await getDataBase()
  try {
    await db.update((data) => {
      const idx = data.products.findIndex((p) => p.id === product.id)
      if (idx >= 0) data.products[idx] = product
      else data.products.push(product)
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export async function updateProductField(id: string, key: string, value: string) {
  const db = await getDataBase()
  try {
    await db.update((data) => {
      const customer = data.customers.find((c) => c.id === id)
      if (customer) customer[key] = value
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export async function restock(data) {
  const db = await getDataBase()

  try {
    await db.update((item) => {
      const product = item.products.find((p) => p.id === data.id)
      if (product) {
        const sumStock = product.stockLast + product.stock
        const sumCost = product.costLast + product.cost
        let rate = 0

        if (product.quantity === 0) {
          product.stockLast = 0
          product.costLast = 0
          rate = data.cost / data.quantity
        } else {
          product.stockLast = sumStock
          product.costLast = sumCost
          rate = (sumCost + data.cost) / (sumStock + data.quantity)
        }
        product.stock = data.quantity
        product.cost = data.cost
        product.rate = Number(rate.toFixed(2))
        product.quantity += data.quantity
      }
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export async function reduceQuantity(data: TSaleProduct) {
  const db = await getDataBase()
  try {
    await db.update((item) => {
      const product = item.products.find((p) => p.id === data.productId)
      if (product) product.quantity -= data.quantity
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export async function trashProducts(ids: string[]) {
  const db = await getDataBase()
  try {
    await db.update((data) => {
      data.products = data.products.map((p) => {
        if (ids.includes(p.id)) p.trashed = true
        return p
      })
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}
