import { TCustomer } from "@shared/models";
import { getDataBase } from "./main";

export async function getCustomers(): Promise<TCustomer[]> {
  const db = await getDataBase();
  return db.data.customers;
}

export async function updateCustomer(customer: TCustomer) {
  const db = await getDataBase();
  let message = "customer added";
  try {
    await db.update((data) => {
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
  const db = await getDataBase();
  try {
    await db.update((data) => {
      const customer = data.customers.find((c) => c.id === id);
      if (customer) customer[key] = value;
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function trashCustomer(ids: string[]) {
  const db = await getDataBase();
  try {
    await db.update((data) => {
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
