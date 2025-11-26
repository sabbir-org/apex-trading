import { TExpense } from "@shared/models";
import { getDataBase, update } from "./main";

export async function getExpenses() {
  const db = await getDataBase();
  return db.data.expense;
}

export async function updateDashboard(key: string, value: any) {
  try {
    await update((data) => {
      data.stats[key] = value;
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function updateExpense(expense: TExpense) {
  try {
    await update((data) => {
      data.expense.push(expense);
    });
    return {
      success: true
    };
  } catch (err) {
    return {
      success: false
    };
  }
}
