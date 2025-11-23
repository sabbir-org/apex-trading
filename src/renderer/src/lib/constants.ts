type Action = {
  product: {
    create: string
    update: string
    delete: string
    stock: string
    sell: string
    edit: string
  }
  customer: {
    create: string
    update: string
    delete: string
    edit: string
    details: string
  }
  supplier: {
    create: string
    update: string
    delete: string
    edit: string
    details: string
  }
  sale: {
    create: string
    update: string
    delete: string
    edit: string
    searchuser: string
    cart: string
    billwarning: string
  }
  purchase: {
    create: string
    delete: string
    update: string
    cart: string
  }
}

export const action: Action = {
  product: {
    create: "new-product",
    update: "update-product",
    delete: "trash-product",
    stock: "stock-product",
    sell: "sell-product",
    edit: "edit-product"
  },
  customer: {
    create: "new-customer",
    update: "update-customer",
    delete: "trash-customer",
    edit: "edit-customer",
    details: "customer-details"
  },
  supplier: {
    create: "new-supplier",
    update: "update-supplier",
    delete: "trash-supplier",
    edit: "edit-supplier",
    details: "supplier-details"
  },
  sale: {
    create: "new-sale",
    update: "update-sale",
    delete: "trash-sale",
    edit: "edit-sale",
    searchuser: "search-user",
    cart: "search-product",
    billwarning: "bill-warning"
  },
  purchase: {
    create: "new-purchase",
    delete: "trash-purchase",
    update: "update-purchase",
    cart: "purchase-cart"
  }
}

export const paymentOptions = ["cash", "cheque", "card", "online"]
