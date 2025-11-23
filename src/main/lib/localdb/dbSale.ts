import { TSale } from "@shared/models";
import { getDataBase } from "./main";

export async function getSales(): Promise<TSale[]> {
  const db = await getDataBase();
  return db.data.sales;
}

export async function updateSale(sale: TSale) {
  const db = await getDataBase();
  try {
    await db.update((data) => {
      const idx = data.sales.findIndex((s) => s.id === sale.id);
      if (idx >= 0) data.sales[idx] = sale;
      else {
        /**
         * put sale data to purchase table
         */
        data.sales.push(sale);

        /**
         * update product stock
         */

        sale.products.map((saleProd) => {
          const product = data.products.find((dataProd) => dataProd.id === saleProd.productId);

          if (product) {
            product.quantity -= saleProd.quantity;
          }
        });

        /**
         * update customer info
         */

        const customer = data.customers.find((dataCustomer) => dataCustomer.id === sale.customerId);

        if (customer) {
          customer.totalPurchase += sale.billAmount;
          customer.totalPaid += sale.paid;
          customer.lastPurchase = sale.billingDate;
        }
      }
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function undoSale(sale: TSale) {
  const db = await getDataBase();
  try {
    await db.update((data) => {
      const customer = data.customers.find((dataCustomer) => dataCustomer.id === sale.customerId);
      if (customer) {
        customer.totalPurchase -= sale.billAmount;
        customer.totalPaid -= sale.paid;
      }

      data.sales = data.sales.filter((dtSale) => dtSale.id !== sale.id);
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
