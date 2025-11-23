import { useSupplierStore } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { TSupplier } from "@shared/models"
import { clsx } from "clsx"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  address: z.string(),
  phone: z.string(),
  identifier: z.string()
})

type FormData = z.infer<typeof schema>

const AddSupplier = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const { updateSupplier } = useSupplierStore()

  const onSubmit = (data: FormData) => {
    console.log("added")
    const postData: TSupplier = {
      id: v4(),
      name: data.name,
      address: data.address,
      phone: data.phone,
      identifier: data.identifier,
      totalSale: 0,
      totalPaid: 0,
      lastSale: "",
      trashed: false
    }
    updateSupplier(postData)
    reset()
  }

  return (
    <div>
      <p className={`font-medium text-gray-800`}>Add Supplier</p>
      <form onSubmit={handleSubmit(onSubmit)} className={`mt-6 space-y-4`}>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="name">Supplier Name</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
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
            className={clsx(`h-8 rounded border px-2 outline-none`, {
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
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.address,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.address
            })}
            type="text"
            placeholder="Enter address"
            {...register("address")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="identifier">Unique Identifier</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.identifier,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.identifier
            })}
            type="text"
            placeholder="Enter identifier"
            {...register("identifier")}
          />
        </div>

        <button
          type="submit"
          className={`h-8 w-full cursor-pointer rounded border border-blue-300 text-blue-600`}
        >
          Add supplier
        </button>
      </form>
    </div>
  )
}
export default AddSupplier
