import { useProductStore } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  brand: z.string(),
  category: z.string(),
  purchasePrice: z.string(),
  salePrice: z.string(),
  initialStock: z.string(),
  unit: z.string(),
  reorderLevel: z.string(),
  currentStock: z.string(),
  stockValue: z.string()
})

type FormData = z.infer<typeof schema>

const EditProduct = ({ sheetProps }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: sheetProps.name,
      brand: sheetProps.brand,
      category: sheetProps.category,
      purchasePrice: sheetProps.purchasePrice.toString(),
      salePrice: sheetProps.salePrice.toString(),
      initialStock: sheetProps.initialStock.toString(),
      unit: sheetProps.unit.toString(),
      reorderLevel: sheetProps.reorderLevel.toString(),
      currentStock: sheetProps.currentStock.toString(),
      stockValue: sheetProps.stockValue.toString()
    }
  })
  const { updateProduct } = useProductStore()

  const onSubmit = (data: FormData) => {
    const postData = {
      ...sheetProps,
      name: data.name,
      brand: data.brand,
      category: data.category,
      purchasePrice: Number(data.purchasePrice),
      salePrice: Number(data.salePrice),
      initialStock: Number(data.initialStock),
      unit: Number(data.unit),
      reorderLevel: Number(data.reorderLevel),
      currentStock: Number(data.currentStock),
      stockValue: Number(data.stockValue)
    }
    console.log(data)
    updateProduct(postData)
    reset()
  }

  return (
    <div>
      <p className={`font-medium text-gray-800`}>Edit Product</p>
      <form onSubmit={handleSubmit(onSubmit)} className={`mt-6 space-y-4`}>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="name">Product Name</label>
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
          <label htmlFor="brand">Brand</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.brand,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.brand
            })}
            type="text"
            placeholder="Enter phone number"
            {...register("brand")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="address">Category</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.category,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.category
            })}
            type="text"
            placeholder="Enter address"
            {...register("category")}
          />
        </div>

        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="balance">Purchase Price</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.purchasePrice,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.purchasePrice
            })}
            type="text"
            placeholder="Enter balance"
            {...register("purchasePrice")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="salePrice">Sale Price</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.salePrice,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.salePrice
            })}
            type="text"
            placeholder="Enter balance"
            {...register("salePrice")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="initialStock">Initial Stock</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.initialStock,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.initialStock
            })}
            type="text"
            placeholder="Enter balance"
            {...register("initialStock")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="unit">Unit</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.unit,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.unit
            })}
            type="text"
            placeholder="Enter balance"
            {...register("unit")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="reorderLevel">Reorder Level</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.reorderLevel,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.reorderLevel
            })}
            type="text"
            placeholder="Enter balance"
            {...register("reorderLevel")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="currentStock">Current Stock</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.currentStock,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.currentStock
            })}
            type="text"
            placeholder="Enter balance"
            {...register("currentStock")}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="stockValue">Stock Value</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.stockValue,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.stockValue
            })}
            type="text"
            placeholder="Enter balance"
            {...register("stockValue")}
          />
        </div>

        <button type="submit" className={`h-9 w-full rounded border border-blue-300 text-blue-600`}>
          save
        </button>
      </form>
    </div>
  )
}
export default EditProduct
