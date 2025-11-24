import { TPurchase } from "@shared/models";
import { getDataBase } from "./main";

export async function getPurchases(): Promise<TPurchase[]> {
  const db = await getDataBase();
  return db.data.purchases;
}

export async function updatePurchase(purchase: TPurchase) {
  const db = await getDataBase();
  try {
    await db.update((table) => {
      const idx = table.purchases.findIndex((s) => s.id === purchase.id);
      if (idx >= 0) table.purchases[idx] = purchase;
      else {
        /**
         * put purchase data to purchase table
         */
        table.purchases.push(purchase);

        /**
         * update product stock
         * recalculate rate
         */

        purchase.products.map((purProd) => {
          const product = table.products.find((tblProd) => tblProd.id === purProd.productId);

          if (product) {
            const { costLast, cost, stockLast, stock } = product;

            const purProdCost = purProd.rate * purProd.quantity;
            let latestRate = 0;

            if (product.quantity === 0) {
              product.costLast = 0;
              product.stockLast = 0;
              latestRate = purProd.rate;
            } else {
              product.stockLast += stock;
              product.costLast += cost;
              latestRate = (costLast + cost + purProdCost) / (stockLast + stock + purProd.quantity);
            }

            product.stock = purProd.quantity;
            product.cost = purProdCost;
            product.rate = Number(latestRate.toFixed(2));
            product.quantity += purProd.quantity;
          }
        });

        /**
         * update supplier info
         */

        const supplier = table.suppliers.find((tblSup) => tblSup.id === purchase.supplierId);

        if (supplier) {
          supplier.totalSale += purchase.billAmount;
          supplier.totalPaid += purchase.paid;
          supplier.lastSale = purchase.billingDate;
        }
      }
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
