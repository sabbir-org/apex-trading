import { bdt } from "@/lib/utils";
import { useModalStore } from "@/store";
import { TPurchase } from "@shared/models";
import { Check, X } from "lucide-react";

const ShortMemo = ({ args }) => {
  const { purchaseData, actionFunction } = args;
  const { id, address, billingDate, billAmount, paid }: TPurchase = purchaseData;

  return (
    <div className={``}>
      <button
        className={`absolute top-4 right-4 cursor-pointer`}
        onClick={useModalStore.getState().closeModal}
      >
        <X className={`text-blue-900/50`}></X>
      </button>
      <div className={`p-6`}>
        <div
          className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100`}
        >
          <Check className={`text-2xl text-blue-600`}></Check>
        </div>
        <h2 className={`mt-4 text-center text-lg font-medium text-blue-900`}>Memo Created</h2>

        <h2 className={`mt-4 text-lg font-medium text-gray-800`}>Purchase Memo</h2>
        <p className={``}>{address}</p>
        <p className={`mt-2 mb-4 text-gray-500`}>
          # {id.slice(0, 6)}....{id.slice(-6)}
        </p>

        <div className={`space-y-3 border-t border-dashed border-gray-400 pt-4`}>
          <div>
            <h2 className={`text-gray-500`}>Bill Amount</h2>
            <p>{bdt(billAmount)}</p>
          </div>
          <div>
            <h2 className={`text-gray-500`}>Paid</h2>
            <p>{bdt(paid)}</p>
          </div>
          <div>
            <h2 className={`text-gray-500`}>Billing Date</h2>
            <p>{billingDate}</p>
          </div>
        </div>

        <button
          className={`ml-auto block h-7 w-fit cursor-pointer rounded border border-blue-400 px-4 text-blue-600`}
          onClick={actionFunction}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default ShortMemo;
