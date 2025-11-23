import { useSupplierStore } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(11),
  address: z.string(),
  totalPurchase: z.string(),
  paid: z.string(),
  due: z.string()
})

type FormData = z.infer<typeof schema>

const EditSupplier = ({ sheetProps }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: sheetProps.name,
      phone: sheetProps.phone,
      address: sheetProps.address,
      totalPurchase: sheetProps.totalPurchase.toString(),
      paid: sheetProps.paid.toString(),
      due: sheetProps.due.toString()
    }
  })

  const { updateSupplier } = useSupplierStore()

  const onSubmit = (data: FormData) => {
    const postData = {
      ...sheetProps,
      name: data.name,
      phone: data.phone,
      address: data.address,
      paid: Number(data.paid)
    }
    updateSupplier(postData)
    reset()
  }

  return (
    <div>
      <p className={`font-medium text-gray-800`}>Add Supplier</p>
      <form onSubmit={handleSubmit(onSubmit)} className={`mt-6 space-y-4`}>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="name">Full Name</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.name,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.name
            })}
            type="text"
            placeholder="Enter customer name"
            {...register("name")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="phone">Contact</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.phone,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.phone
            })}
            type="text"
            placeholder="Enter phone number"
            {...register("phone")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="address">Address</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.address,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.address
            })}
            type="text"
            placeholder="Enter address"
            {...register("address")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="totalPurchase">Total Purchase (BDT)</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.totalPurchase,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.totalPurchase
            })}
            type="text"
            placeholder="Enter balance"
            {...register("totalPurchase")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="paid">Paid (BDT)</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.paid,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.paid
            })}
            type="text"
            placeholder="Enter balance"
            {...register("paid")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="due">Due (BDT)</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.due,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.due
            })}
            type="text"
            placeholder="Enter balance"
            {...register("due")}
          />
        </div>

        <button type="submit" className={`h-9 w-full rounded border border-blue-300 text-blue-600`}>
          save
        </button>
      </form>
    </div>
  )
}
export default EditSupplier
