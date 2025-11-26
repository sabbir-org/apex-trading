import { TProduct, TSaleProduct } from "@shared/models";
import { getDataBase, update } from "./main";

export async function getProducts(): Promise<TProduct[]> {
  const db = await getDataBase();
  return db.data.products;
}

export async function updateProduct(product: TProduct) {
  try {
    await update((data) => {
      const idx = data.products.findIndex((p) => p.id === product.id);
      if (idx >= 0) data.products[idx] = product;
      else data.products.push(product);
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// issue in this function why customer instead of product
export async function updateProductField(id: string, key: string, value: string) {
  try {
    await update((data) => {
      const customer = data.customers.find((c) => c.id === id);
      if (customer) customer[key] = value;
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function restock(data) {
  try {
    await update((table) => {
      const product = table.products.find((p) => p.id === data.id);

      if (product) {
        const { costLast, cost, stockLast, stock } = product;

        const dataCost = data.rate * data.quantity;
        let latestRate = 0;

        if (product.quantity === 0) {
          product.stockLast = 0;
          product.costLast = 0;
          latestRate = data.rate;
        } else {
          product.stockLast += stock;
          product.costLast += cost;
          latestRate = (costLast + cost + dataCost) / (stockLast + stock + data.quantity);
        }
        product.stock = data.quantity;
        product.cost = dataCost;
        product.rate = Number(latestRate.toFixed(2));
        product.quantity += data.quantity;
      }
    });
    return { success: true, message: "Product restocked" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to restock" };
  }
}

export async function reduceQuantity(data: TSaleProduct) {
  try {
    await update((item) => {
      const product = item.products.find((p) => p.id === data.productId);
      if (product) product.quantity -= data.quantity;
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function trashProducts(ids: string[]) {
  try {
    await update((data) => {
      data.products = data.products.map((p) => {
        if (ids.includes(p.id)) p.trashed = true;
        return p;
      });
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
