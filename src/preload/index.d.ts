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
      getProducts: () => Promise<TProduct[]>;
      updateProduct: (product: TProduct) => Promise<{ success: boolean }>;
      reduceQuantity: (data: TSaleProduct) => Promise<{ success: boolean }>;
      updateProductField: (id: string, key: string, value: string) => Promise<{ success: boolean }>;
      restock: (data: {
        id: string;
        quantity: number;
        cost: number;
      }) => Promise<{ success: boolean }>;
      trashProducts: (ids: string[]) => Promise<{ success: boolean }>;

      getCustomers: () => Promise<TCustomer[]>;
      updateCustomer: (customer: TCustomer) => Promise<{ success: boolean; message: string }>;
      updateCustomerField: (
        id: string,
        key: string,
        value: string
      ) => Promise<{ success: boolean }>;
      trashCustomer: (ids: string[]) => Promise<{ success: boolean }>;

      getSuppliers: () => Promise<TSupplier[]>;
      updateSupplier: (customer: TSupplier) => Promise<{ success: boolean; message: string }>;
      trashSupplier: (ids: string[]) => Promise<{ success: boolean }>;

      getSales: () => Promise<TSale[]>;
      updateSale: (sale: TSale) => Promise<{ success: boolean; message: string }>;
      undoSale: (sale: TSale) => Promise<{ success: boolean; message: string }>;

      getPurchases: () => Promise<TPurchase[]>;
      updatePurchase: (customer: TPurchase) => Promise<{ success: boolean; message: string }>;

      getExpenses: () => Promise<TExpense[]>;
      updateDashboard: (key: string, value: any) => Promise<{ success: boolean }>;
      updateExpense: (expense: TExpense) => Promise<{ success: boolean }>;

      uploadToDrive: () => Promise<{ success: boolean; message: string }>;
      login: () => Promise<{ success: boolean; message: string }>;
      verify: () => Promise<{ success: boolean; message: string; data?: any }>;

      getLedger: () => Promise<any[]>;
      updateLedger: (invoice: any) => Promise<{ success: boolean }>;
      trashMemo: (invoiceId: string) => Promise<{ success: boolean }>;
    };
  }
}
