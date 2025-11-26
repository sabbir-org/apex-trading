import {
  TCustomer,
  TExpense,
  TMeta,
  TProduct,
  TPurchase,
  TSale,
  TStats,
  TSupplier
} from "@shared/models";
import fs from "fs-extra";
import { JSONFilePreset } from "lowdb/node";
import { join } from "path";
import { getAppDir } from "../root";

type Database = {
  products: TProduct[];
  customers: TCustomer[];
  sales: TSale[];
  suppliers: TSupplier[];
  purchases: TPurchase[];
  expense: TExpense[];
  stats: TStats;
  meta: TMeta;
};

let _db: Awaited<ReturnType<typeof JSONFilePreset<Database>>> | null = null;

const getDbPath = () => {
  return join(getAppDir(), "appdb.json");
};

export async function getDataBase() {
  if (!_db) {
    const dbPath = getDbPath();
    await fs.ensureDir(getAppDir());

    // Initialize with empty array if file is empty/missing
    if (!(await fs.pathExists(dbPath))) {
      await fs.writeJSON(dbPath, {
        products: [],
        customers: [],
        suppliers: [],
        sales: [],
        purchases: [],
        expense: [],
        stats: {},
        meta: {}
      });
    }
    _db = await JSONFilePreset<any>(dbPath, {
      products: [],
      customers: [],
      suppliers: [],
      sales: [],
      purchases: [],
      expense: [],
      stats: {},
      meta: {}
    });
  }
  return _db;
}

export async function reloadDatabase() {
  _db = null; // Clear cached DB instance
  await getDataBase(); // Reloads fresh from disk
}

export async function update(cb: (data: Database) => void) {
  if (!_db) {
    _db = await getDataBase();
  }
  await _db.update((table) => {
    cb(table);
    table.meta.lastUpdated = Date.now(); // auto timestamp
  });
}
