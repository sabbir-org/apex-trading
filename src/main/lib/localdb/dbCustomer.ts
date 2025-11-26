import { TCustomer } from "@shared/models";
import { getDataBase, update } from "./main";

export async function getCustomers(): Promise<TCustomer[]> {
  const db = await getDataBase();
  return db.data.customers;
}

export async function updateCustomer(customer: TCustomer) {
  let message = "customer added";
  try {
    await update((data) => {
      const idx = data.customers.findIndex((c) => c.id === customer.id);
      if (idx >= 0) {
        data.customers[idx] = customer;
        message = "customer updated";
      } else data.customers.push(customer);
    });
    return { success: true, message };
  } catch (err) {
    return { success: false, message: "Failed" };
  }
}

export async function updateCustomerField(id: string, key: string, value: string) {
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

export async function trashCustomer(ids: string[]) {
  try {
    await update((data) => {
      data.customers = data.customers.map((c) => {
        if (ids.includes(c.id)) c.trashed = true;
        return c;
      });
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
