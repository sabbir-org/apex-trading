import { getProductId } from "@/lib/utils"
import { useProductStore } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  size: z.string().min(1),
  unit: z.string().min(1)
})

type FormData = z.infer<typeof schema>

const AddProduct = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const { updateProduct, getLastId } = useProductStore()

  const onSubmit = (data: FormData) => {
    const postData = {
      id: getProductId(getLastId()),
      name: data.name,
      category: data.category,
      brand: data.brand,
      stockLast: 0,
      costLast: 0,
      stock: 0,
      cost: 0,
      size: data.size,
      unit: data.unit,
      rate: 0,
      quantity: 0,
      trashed: false
    }
    updateProduct(postData)
    // console.log(postData)
    reset()
  }

  return (
    <div>
      <p className={`font-medium text-gray-800`}>Add New Product</p>
      <form onSubmit={handleSubmit(onSubmit)} className={`mt-6 space-y-4`}>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="name">Product Name</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.name,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.name
            })}
            type="text"
            placeholder="product name"
            {...register("name")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="address">Category</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.category,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.category
            })}
            type="text"
            placeholder="product category"
            {...register("category")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="brand">Brand</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.brand,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.brand
            })}
            type="text"
            placeholder="product brand"
            {...register("brand")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="size">Size</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.size,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.size
            })}
            type="text"
            placeholder="product size"
            {...register("size")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="unit">Unit</label>
          <input
            className={clsx(`h-8 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.unit,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.unit
            })}
            type="text"
            placeholder="size unit"
            {...register("unit")}
          />
        </div>

        <button type="submit" className={`h-8 w-full rounded border border-blue-300 text-blue-600`}>
          Add product
        </button>
      </form>
    </div>
  )
}
export default AddProduct
