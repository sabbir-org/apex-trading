import { useModalStore, useProductStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  quantity: z.number(),
  rate: z.number()
});

type FormData = z.infer<typeof schema>;

const Restock = ({ args }) => {
  const { restock } = useProductStore();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    const postData = {
      id: args.productId,
      quantity: data.quantity,
      rate: data.rate
    };
    restock(postData);
    reset();
    useModalStore.getState().closeModal();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4`}>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="quantity">Quantity</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.quantity,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.quantity
            })}
            type="text"
            placeholder="quantity"
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>
        <div className={`flex flex-col gap-y-2`}>
          <label htmlFor="rate">Rate</label>
          <input
            className={clsx(`h-9 rounded border px-2 outline-none`, {
              "focus:border-red-300 focus:bg-red-50/30": errors.rate,
              "focus:border-blue-300 focus:bg-blue-50/30": !errors.rate
            })}
            type="text"
            placeholder="rate"
            {...register("rate", { valueAsNumber: true })}
          />
        </div>
        <button
          type="submit"
          className={`h-9 w-full rounded border border-blue-400 text-blue-600 outline-none`}
        >
          update
        </button>
      </form>
    </div>
  );
};

export default Restock;
