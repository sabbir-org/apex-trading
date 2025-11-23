import Options from "@/components/options"
import { Subtitle, Title } from "@/components/typography"
import { DatePicker } from "@/components/ui/datePicker"
import { action, paymentOptions } from "@/lib/constants"
import { useCustomerStore, useModalStore, useProductStore, useSaleStore } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { TSale } from "@shared/models"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"
import { z } from "zod"
import Invoice from "./Invoice"

const schema = z.object({
  serial: z.string(),
  poNum: z.string(),
  chalanNum: z.string(),
  products: z.array(z.any()),
  customer: z.any(),
  desc: z.string(),
  billingDate: z.string(),
  paymentOption: z.array(z.any()),
  paid: z.number(),
  profit: z.number(),
  billAmount: z.number()
})

type FormData = z.infer<typeof schema>

const NewSale = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      billingDate: new Date().toLocaleDateString(),
      billAmount: 0,
      desc: "default bill",
      paid: 0,
      paymentOption: [],
      profit: 0
    }
  })

  const { openModal } = useModalStore()
  const { customers } = useCustomerStore()
  const { products } = useProductStore()
  const { updateSale } = useSaleStore()

  const onSubmit = (data: FormData) => {
    const postData: TSale = {
      id: v4(),
      billNum: data.serial ? data.serial + data.customer?.name : "retail",
      address: data.customer?.address || "N/A",
      billingDate: data.billingDate,
      customerId: data.customer?.id || "N/A",
      products: data.products,
      billAmount: data.products.reduce((acc, curr) => acc + curr.rate * curr.quantity, 0),
      paid: data.paid,
      paymentOption: data.paymentOption,
      chalanNum: data.chalanNum,
      poNum: data.poNum,
      desc: data.desc,
      profit: data.profit
    }

    updateSale(postData)
  }
  const formData = watch()

  return (
    <div className={`flex gap-x-2`}>
      <div className={`w-[40%]`}>
        <div className={`mt-2 mb-8`}>
          <Title>New Sale</Title>
          <Subtitle>create new bill</Subtitle>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-2`}>
          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="serial">Serial</label>
            <input
              className={clsx(`h-8 rounded border px-2 outline-none`, {
                "focus:border-red-300 focus:bg-red-50/30": errors.serial,
                "focus:border-blue-300 focus:bg-blue-50/30": !errors.serial
              })}
              type="text"
              placeholder="custom bill number"
              {...register("serial")}
            />
          </div>
          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="poNum">PO Number</label>
            <input
              className={clsx(`h-8 rounded border px-2 outline-none`, {
                "focus:border-red-300 focus:bg-red-50/30": errors.poNum,
                "focus:border-blue-300 focus:bg-blue-50/30": !errors.poNum
              })}
              type="text"
              placeholder="enter PO number"
              {...register("poNum")}
            />
          </div>
          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="chalanNum">Chalan Number</label>
            <input
              className={clsx(`h-8 rounded border px-2 outline-none`, {
                "focus:border-red-300 focus:bg-red-50/30": errors.chalanNum,
                "focus:border-blue-300 focus:bg-blue-50/30": !errors.chalanNum
              })}
              type="text"
              placeholder="enter chalan number"
              {...register("chalanNum")}
            />
          </div>

          <DatePicker
            label="Billing Date"
            date={formData.billingDate}
            setDate={setValue}
          ></DatePicker>

          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="customer">Customer</label>
            <div
              className={`flex h-8 items-center rounded border px-2 hover:bg-zinc-100`}
              onClick={() =>
                openModal(action.sale.searchuser, {
                  storedUsers: customers,
                  userType: "customer",
                  setUser: setValue
                })
              }
            >
              <p>{formData.customer?.name || "select customer"}</p>
            </div>
          </div>
          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="products">Products</label>
            <div
              className={`flex h-8 items-center rounded border px-2 hover:bg-zinc-100`}
              onClick={() =>
                openModal(action.sale.cart, {
                  storedItems: products,
                  setValue: setValue
                })
              }
            >
              <p>{"select products"}</p>
            </div>
          </div>

          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="paymentOption">Payment Option</label>
            <Options
              placeholder="payment options"
              options={paymentOptions}
              selectedOptions={formData.paymentOption}
              setSelectedOptions={setValue}
              label={"paymentOption"}
            ></Options>
          </div>

          <div className={`flex flex-col gap-y-2`}>
            <label htmlFor="paid">Paid</label>
            <input
              className={clsx(`h-8 rounded border px-2 outline-none`, {
                "focus:border-red-300 focus:bg-red-50/30": errors.paid,
                "focus:border-blue-300 focus:bg-blue-50/30": !errors.paid
              })}
              type="text"
              placeholder="paid amount"
              value={formData.paid === 0 ? "" : formData.paid}
              onChange={(e) => {
                const value = e.target.value === "" ? 0 : Number(e.target.value)
                setValue("paid", value)
              }}
            />
          </div>

          <button
            type="submit"
            className={`mt-2 h-8 cursor-pointer rounded border border-blue-400 px-4 text-blue-600`}
          >
            Confirm Sale
          </button>
        </form>
      </div>
      <div className={`w-[60%]`}>
        <Invoice saleData={formData}></Invoice>
      </div>
    </div>
  )
}

export default NewSale
