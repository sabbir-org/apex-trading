export type TProduct = {
  id: string
  name: string
  category: string
  brand: string
  stockLast: number
  costLast: number
  stock: number
  cost: number
  rate: number
  size: string
  unit: string
  quantity: number
  trashed: boolean
  [key: string]: any
}

export type TCustomer = {
  id: string
  name: string
  identifier: string
  address: string
  phone: string
  lastPurchase: string
  totalPurchase: number
  totalPaid: number
  [key: string]: any
  trashed: boolean
}

export type TSupplier = {
  id: string
  name: string
  identifier: string
  address: string
  phone: string
  totalSale: number
  lastSale: string
  totalPaid: number
  [key: string]: any
  trashed: boolean
}

export type TSaleProduct = {
  name: string
  brand: string
  size: string
  unit: string
  productId: string
  quantity: number
  buyRate: number
  rate: number
}
export type TSale = {
  address: string
  billAmount: number
  billNum: string
  chalanNum: string
  billingDate: string
  customerId: string
  desc: string
  id: string
  paid: number
  paymentOption: string[]
  poNum: string
  products: TSaleProduct[]
  profit: number
  [key: string]: any
}

export type TPurchaseProduct = {
  name: string
  brand: string
  size: string
  unit: string
  productId: string
  quantity: number
  rate: number
}

export type TPurchase = {
  address: string
  billAmount: number
  billNum: string
  billingDate: string
  chalanNum: string
  desc: string
  id: string
  paid: number
  paymentOption: string[]
  poNum: string
  products: TPurchaseProduct[]
  supplierId: string
  [key: string]: any
}

export type TExpense = {
  date: string
  name: string
  amount: number
}

export type TStats = {
  totalSale: number
  totalCollection: number
  totalPayment: number
  totalExpense: number
}
