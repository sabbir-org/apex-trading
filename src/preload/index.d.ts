import {
  TCustomer,
  TExpense,
  TProduct,
  TPurchase,
  TSale,
  TSaleProduct,
  TSupplier
} from "@shared/models";

declare global {
  interface Window {
    context: {
      /** --------------------- Products -----------------------------------*/
      getProducts: () => Promise<TProduct[]>;
      updateProduct: (product: TProduct) => Promise<{ success: boolean }>;
      reduceQuantity: (data: TSaleProduct) => Promise<{ success: boolean }>;
      updateProductField: (id: string, key: string, value: string) => Promise<{ success: boolean }>;
      restock: (data: {
        id: string;
        quantity: number;
        rate: number;
      }) => Promise<{ success: boolean; message: string }>;
      trashProducts: (ids: string[]) => Promise<{ success: boolean }>;

      /** --------------------- Customers -----------------------------------*/
      getCustomers: () => Promise<TCustomer[]>;
      updateCustomer: (customer: TCustomer) => Promise<{ success: boolean; message: string }>;
      updateCustomerField: (
        id: string,
        key: string,
        value: string
      ) => Promise<{ success: boolean }>;
      trashCustomer: (ids: string[]) => Promise<{ success: boolean }>;

      /** --------------------- Suppliers -----------------------------------*/
      getSuppliers: () => Promise<TSupplier[]>;
      updateSupplier: (customer: TSupplier) => Promise<{ success: boolean; message: string }>;
      trashSupplier: (ids: string[]) => Promise<{ success: boolean }>;

      /** --------------------- Sales -----------------------------------*/
      getSales: () => Promise<TSale[]>;
      updateSale: (sale: TSale) => Promise<{ success: boolean; message: string }>;
      undoSale: (sale: TSale) => Promise<{ success: boolean; message: string }>;

      /** --------------------- Purchases -----------------------------------*/
      getPurchases: () => Promise<TPurchase[]>;
      updatePurchase: (customer: TPurchase) => Promise<{ success: boolean; message: string }>;

      /** --------------------- Extra -----------------------------------*/
      getExpenses: () => Promise<TExpense[]>;
      updateDashboard: (key: string, value: any) => Promise<{ success: boolean }>;
      updateExpense: (expense: TExpense) => Promise<{ success: boolean }>;

      /** --------------------- Cloud ------------------------------------- */
      uploadToDrive: () => Promise<{ success: boolean; message: string }>;
      login: () => Promise<{ success: boolean; message: string }>;
      verify: () => Promise<{ success: boolean; message: string; data?: any }>;

      getLedger: () => Promise<any[]>;
      updateLedger: (invoice: any) => Promise<{ success: boolean }>;
      trashMemo: (invoiceId: string) => Promise<{ success: boolean }>;

      /** --------------------- Updates and db ----------------------------*/
      reloadDatabase: () => Promise<void>;
      hasNewUpdate: () => Promise<{ success: boolean; message: string }>;
      onUpdateStatus: (callback: (event: any, message: string) => void) => void;
      onDownloadProgress: (callback: (event: any, progress: any) => void) => void;
      checkForUpdates: () => void;
      restartApp: () => void;
    };
  }
}
