import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";

import {
  getCustomers,
  trashCustomer,
  updateCustomer,
  updateCustomerField
} from "./lib/localdb/dbCustomer";

import { authWindow, login, verify } from "./lib/cloud/auth";
import { uploadToDrive } from "./lib/cloud/drive";
import { getExpenses, updateDashboard, updateExpense } from "./lib/localdb/dbExtra";
import {
  getProducts,
  reduceQuantity,
  restock,
  trashProducts,
  updateProduct,
  updateProductField
} from "./lib/localdb/dbProduct";
import { getPurchases, updatePurchase } from "./lib/localdb/dbPurchase";
import { getSales, undoSale, updateSale } from "./lib/localdb/dbSale";
import { getSuppliers, trashSupplier, updateSupplier } from "./lib/localdb/dbSupplier";

export let mainWindow: BrowserWindow;
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "Apex Trading",
    icon: is.dev
      ? join(__dirname, "../../resources/icon.png")
      : join(__dirname, "../build/icon.ico"),

    width: is.dev ? 1900 : 1500,
    minWidth: 1200,
    maxWidth: 1600,
    height: 900,
    minHeight: 800,
    maxHeight: 900,
    resizable: true,
    maximizable: false, // disables maximize button
    fullscreenable: false, // disables fullscreen (macOS and shortcuts)
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // check if any issue. any memory lick etc
  mainWindow.on("closed", () => {
    if (authWindow) {
      authWindow.close();
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // ✅ Open DevTools in development
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools({ mode: "right" });
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  /** Products */
  ipcMain.handle("getProducts", async () => await getProducts());
  ipcMain.handle("updateProduct", async (_, product) => await updateProduct(product));
  ipcMain.handle("reduceQuantity", async (_, data) => await reduceQuantity(data));
  ipcMain.handle(
    "updateProductField",
    async (_, id, key, value) => await updateProductField(id, key, value)
  );
  ipcMain.handle("restock", async (_, data) => await restock(data));
  ipcMain.handle("trashProducts", async (_, ids: string[]) => await trashProducts(ids));

  /** Customers */
  ipcMain.handle("getCustomers", async () => await getCustomers());
  ipcMain.handle("updateCustomer", async (_, customer) => await updateCustomer(customer));
  ipcMain.handle(
    "updateCustomerField",
    async (_, id, key, value) => await updateCustomerField(id, key, value)
  );
  ipcMain.handle("trashCustomer", async (_, ids: string[]) => await trashCustomer(ids));

  /** Suppliers */
  ipcMain.handle("getSuppliers", async () => await getSuppliers());
  ipcMain.handle("updateSupplier", async (_, supplier) => await updateSupplier(supplier));
  ipcMain.handle("trashSupplier", async (_, ids: string[]) => await trashSupplier(ids));

  /** Sales */
  ipcMain.handle("getSales", async () => await getSales());
  ipcMain.handle("updateSale", async (_, sale) => await updateSale(sale));
  ipcMain.handle("undoSale", async (_, sale) => await undoSale(sale));

  /** Purchases */
  ipcMain.handle("getPurchases", async () => await getPurchases());
  ipcMain.handle("updatePurchase", async (_, purchase) => await updatePurchase(purchase));

  /** Extra */
  ipcMain.handle("getExpenses", async () => await getExpenses());
  ipcMain.handle("updateDashboard", async (_, key, value) => await updateDashboard(key, value));
  ipcMain.handle("updateExpense", async (_, expense) => await updateExpense(expense));

  /** Cloud */
  ipcMain.handle("uploadToDrive", async () => await uploadToDrive());
  ipcMain.handle("login", async () => await login());
  ipcMain.handle("verify", async () => await verify());

  createWindow();
  // verify().catch(console.error)

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
