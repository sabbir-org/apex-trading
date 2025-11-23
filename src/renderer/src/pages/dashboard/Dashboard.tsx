import { Subtitle, Title } from "@/components/typography"
import { bdt } from "@/lib/utils"
import {
  useCustomerStore,
  useExtraStore,
  useProductStore,
  usePurchaseStore,
  useSaleStore,
  useSupplierStore
} from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { TExpense } from "@shared/models"
import clsx from "clsx"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  date: z.string(),
  name: z.string().min(1),
  amount: z.number()
})

type FormData = z.infer<typeof schema>

const Dashboard = () => {
  const { sales } = useSaleStore()
  const { purchases } = usePurchaseStore()
  const { products } = useProductStore()
  const { customers } = useCustomerStore()
  const { suppliers } = useSupplierStore()
  const { expensesToday, updateExpense } = useExtraStore()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toLocaleDateString()
    }
  })

  const todayBills = sales.filter((sale) => new Date().toLocaleDateString() === sale.billingDate)

  const totalCollection = todayBills.reduce((acc, curr) => acc + curr.paid, 0)
  const totalSaleToday = todayBills.reduce((acc, curr) => acc + curr.billAmount, 0)

  const todayAllProducts = todayBills.map((sale) => sale.products).flat()
  const profit = todayAllProducts.reduce(
    (acc, curr) => acc + (curr.rate - curr.buyRate) * curr.quantity,
    0
  )

  const stockValue = products.reduce((acc, curr) => acc + curr.quantity * curr.rate, 0)
  const customerDue = customers.reduce((acc, curr) => acc + curr.totalPurchase - curr.totalPaid, 0)

  /**
   * supply
   */

  const memoToday = purchases.filter(
    (purchase) => purchase.billingDate === new Date().toLocaleDateString()
  )
  const totalPurchaseToday = memoToday.reduce((acc, curr) => acc + curr.billAmount, 0)
  const totalSupplierPaid = suppliers.reduce((acc, curr) => acc + curr.totalPaid, 0)
  const totalSupplierDue = suppliers.reduce((acc, curr) => acc + curr.totalSale - curr.totalPaid, 0)

  const handleExpense = (data: TExpense) => {
    updateExpense(data)
    reset()
  }

  return (
    <>
      <div className={`mt-2 mb-8`}>
        <Title>Dashboard</Title>
        <Subtitle>sale, purchase, stock and statistics</Subtitle>
      </div>
      <div className={`grid h-[300px] grid-cols-3 gap-x-3`}>
        <div /**
        |--------------------------------------------------
        | total today
        |--------------------------------------------------
        */
          className={`space-y-3`}
        >
          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Sale</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(totalSaleToday)}</span>
            <p className={`text-sm text-gray-400`}>Total sales for today</p>
          </div>

          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Collection</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(totalCollection)}</span>
            <p className={`text-sm text-gray-400`}>Total collection for today</p>
          </div>

          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Profit</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(profit)}</span>
            <p className={`text-sm text-gray-400`}>Profit today</p>
          </div>

          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Purchase</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(totalPurchaseToday)}</span>
            <p className={`text-sm text-gray-400`}>Total purchases for today</p>
          </div>
        </div>

        <div /**
        |--------------------------------------------------
        | total all time
        |--------------------------------------------------
        */
          className={`space-y-3`}
        >
          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Stock Value</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(stockValue)}</span>
            <p className={`text-sm text-gray-400`}>Sum of StockValue</p>
          </div>
          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Customer Due</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(customerDue)}</span>
            <p className={`text-sm text-gray-400`}>Sum of Customer balances</p>
          </div>
          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Payment</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(totalSupplierPaid)}</span>
            <p className={`text-sm text-gray-400`}>Sum of Supplier Payment</p>
          </div>
          <div className={`flex flex-col gap-y-4 rounded-md bg-gray-50 p-4`}>
            <span className={`font-medium text-gray-600`}>Total Supplier Due</span>
            <span className={`text-3xl font-medium text-blue-700`}>{bdt(totalSupplierDue)}</span>
            <p className={`text-sm text-gray-400`}>Sum of Supplier dues</p>
          </div>
        </div>

        <div
          /**
        |--------------------------------------------------
        | total expense
        |--------------------------------------------------
        */ className={`relative row-span-4 flex flex-col justify-between overflow-y-auto rounded-md bg-gray-50 p-4`}
        >
          <div className={`flex flex-col overflow-y-auto`}>
            <span className={`font-medium text-gray-600`}>Daily Expense</span>
            <form
              onSubmit={handleSubmit(handleExpense)}
              className={`mt-2 flex justify-between gap-x-2`}
            >
              <input
                type="text"
                className={clsx(`h-8 w-[40%] rounded border px-2 outline-none`, {
                  "focus:border-red-300 focus:bg-red-50/30": errors.name,
                  "focus:border-blue-300 focus:bg-blue-50/30": !errors.name
                })}
                placeholder="enter name"
                {...register("name")}
              />
              <input
                type="text"
                className={clsx(`h-8 w-[40%] rounded border px-2 outline-none`, {
                  "focus:border-red-300 focus:bg-red-50/30": errors.amount,
                  "focus:border-blue-300 focus:bg-blue-50/30": !errors.amount
                })}
                placeholder="enter amount"
                {...register("amount", { valueAsNumber: true })}
              />
              <button
                type="submit"
                className={`h-8 w-[70px] cursor-pointer rounded border border-blue-400 outline-none`}
              >
                <Plus className={`mx-auto h-5 w-5 text-blue-600`}></Plus>
              </button>
            </form>

            <p className={`mt-2 text-sm text-gray-400`}>Expense List</p>

            <div
              className={`mt-2 flex h-8 items-center justify-between rounded-t border border-b-0 px-2 font-medium`}
            >
              <p>Name</p>
              <p>Amount</p>
            </div>

            <div className={`overflow-y-auto rounded-b border border-t-0`}>
              {expensesToday?.map((exp, indx) => {
                return (
                  <div key={indx} className={`flex h-8 items-center justify-between border-t px-2`}>
                    <p>{exp.name.slice(0, 1).toUpperCase() + exp.name.slice(1)}</p>
                    <p>{exp.amount}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={`mt-2 flex flex-col gap-y-2`}>
            <span className={`font-medium text-gray-600`}>Total Daily Expense</span>
            <span className={`text-3xl font-medium text-blue-700`}>
              {bdt(expensesToday?.reduce((acc, curr) => acc + curr.amount, 0))}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
