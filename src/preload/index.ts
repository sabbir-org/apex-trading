import { TCustomer, TExpense, TProduct, TPurchase, TSale, TSupplier } from "@shared/models";
import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}

try {
  contextBridge.exposeInMainWorld("context", {
    getProducts: () => ipcRenderer.invoke("getProducts"),
    updateProduct: (product: TProduct) => ipcRenderer.invoke("updateProduct", product),
    updateProductField: (id: string, key: string, value: string) =>
      ipcRenderer.invoke("updateProductField", id, key, value),
    restock: (data) => ipcRenderer.invoke("restock", data),
    reduceQuantity: (data) => ipcRenderer.invoke("reduceQuantity", data),
    trashProducts: (ids: string[]) => ipcRenderer.invoke("trashProducts", ids),

    recalculateQuantity: (id: string, current: number, newQuantity: number) =>
      ipcRenderer.invoke("recalculateQuantity", id, current, newQuantity),

    getCustomers: () => ipcRenderer.invoke("getCustomers"),
    updateCustomer: (customer: TCustomer) => ipcRenderer.invoke("updateCustomer", customer),
    updateCustomerField: (id: string, key: string, value: string) =>
      ipcRenderer.invoke("updateCustomerField", id, key, value),
    trashCustomer: (ids: string[]) => ipcRenderer.invoke("trashCustomer", ids),

    getSuppliers: () => ipcRenderer.invoke("getSuppliers"),
    updateSupplier: (supplier: TSupplier) => ipcRenderer.invoke("updateSupplier", supplier),
    trashSupplier: (ids: string[]) => ipcRenderer.invoke("trashSupplier", ids),

    getSales: () => ipcRenderer.invoke("getSales"),
    updateSale: (sale: TSale) => ipcRenderer.invoke("updateSale", sale),
    undoSale: (sale: TSale) => ipcRenderer.invoke("undoSale", sale),

    getPurchases: () => ipcRenderer.invoke("getPurchases"),
    updatePurchase: (purchase: TPurchase) => ipcRenderer.invoke("updatePurchase", purchase),

    getExpenses: () => ipcRenderer.invoke("getExpenses"),
    updateDashboard: (key: string, value: any) => ipcRenderer.invoke("updateDashboard", key, value),
    updateExpense: (expense: TExpense) => ipcRenderer.invoke("updateExpense", expense),

    readFromDrive: () => ipcRenderer.invoke("readFromDrive"),
    uploadToDrive: () => ipcRenderer.invoke("uploadToDrive"),
    login: () => ipcRenderer.invoke("login"),
    verify: () => ipcRenderer.invoke("verify"),
    // onUserData: (callback) =>
    //   ipcRenderer.on("drive:userdata", (_, data) => {
    //     callback(data);
    //   }),

    getLedger: () => ipcRenderer.invoke("getLedger"),
    updateLedger: (invoice: any) => ipcRenderer.invoke("updateLedger", invoice),
    trashMemo: (invoiceId: string) => ipcRenderer.invoke("trashMemo", invoiceId),

    reloadDatabase: () => ipcRenderer.invoke("reloadDatabase"),
    hasNewUpdate: () => ipcRenderer.invoke("hasNewUpdate"),
    onUpdateStatus: (callback) => ipcRenderer.on("update-status", callback),
    onDownloadProgress: (callback) => ipcRenderer.on("download-progress", callback),
    checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
    restartApp: () => ipcRenderer.invoke("restart-app")
  });
} catch (error) {
  console.error(error);
}
