import { TExpense } from "@shared/models"
import { getDataBase } from "./main";


export async function getExpenses() {
  const db = await getDataBase()
  return db.data.expense
}

export async function updateDashboard(key: string, value: any) {
  const db = await getDataBase()
  try {
    await db.update((data) => {
      data.stats[key] = value
    })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export async function updateExpense(expense: TExpense) {
  const db = await getDataBase()
  try {
    await db.update((data) => {
      data.expense.push(expense)
    })
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false
    }
  }
}
