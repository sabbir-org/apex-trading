import { TCustomer, TExpense, TProduct, TPurchase, TSale, TStats, TSupplier } from "@shared/models";
import fs from "fs-extra";
import { JSONFilePreset } from "lowdb/node";
import { join } from "path";
import { getRootDir } from "../root";

type Database = {
  products: TProduct[];
  customers: TCustomer[];
  sales: TSale[];
  suppliers: TSupplier[];
  purchases: TPurchase[];
  expense: TExpense[];
  stats: TStats;
};

let _db: Awaited<ReturnType<typeof JSONFilePreset<Database>>> | null = null;

const getDbPath = () => {
  return join(getRootDir(), "appdb.json");
};

export async function getDataBase() {
  if (!_db) {
    const dbPath = getDbPath();
    await fs.ensureDir(getRootDir());

    // Initialize with empty array if file is empty/missing
    if (!(await fs.pathExists(dbPath))) {
      await fs.writeJSON(dbPath, {
        products: [],
        customers: [],
        suppliers: [],
        sales: [],
        purchases: [],
        expense: [],
        stats: {}
      });
    }
    _db = await JSONFilePreset<any>(dbPath, {
      products: [],
      customers: [],
      suppliers: [],
      sales: [],
      purchases: [],
      expense: [],
      stats: {}
    });
  }
  return _db;
}
