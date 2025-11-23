import { TSupplier } from "@shared/models";
import { getDataBase } from "./main";

export async function getSuppliers(): Promise<TSupplier[]> {
  const db = await getDataBase();
  return db.data.suppliers;
}

export async function updateSupplier(supplier: TSupplier) {
  const db = await getDataBase();
  let message = "supplier added";
  try {
    await db.update((data) => {
      const idx = data.suppliers.findIndex((c) => c.id === supplier.id);
      if (idx >= 0) {
        data.suppliers[idx] = supplier;
        message = "supplier updated";
      } else data.suppliers.push(supplier);
    });
    return { success: true, message };
  } catch (err) {
    return { success: false, message: "Failed" };
  }
}

export async function trashSupplier(ids: string[]) {
  const db = await getDataBase();
  try {
    await db.update((data) => {
      data.suppliers = data.suppliers.map((c) => {
        if (ids.includes(c.id)) c.trashed = true;
        return c;
      });
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
