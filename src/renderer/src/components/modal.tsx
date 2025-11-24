import { action } from "@/lib/constants";
import DeleteSale from "@/pages/ledger/DeleteSale";
import Restock from "@/pages/product/Restock";
import Cart from "@/pages/purchase/Cart";
import BillWarning from "@/pages/sale/BillWarning";
import SaleCart from "@/pages/sale/Cart";
import MiniMemo from "@/pages/sale/MiniMemo";
import { useModalStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { Confirm } from ".";
import style from "./css/modal.module.css";
import SearchUser from "./searchUser";

function Modal() {
  const { openModalId, argProps } = useModalStore();

  if (!openModalId) return null;

  return (
    <Template props={argProps}>
      {
        {
          [action.product.delete]: (
            <Confirm
              data={argProps?.data}
              onConfirm={argProps?.actionFunction}
              title="Confirm Product Deletion"
              description="Data will be moved to trash you can undo this action later"
            ></Confirm>
          ),

          [action.product.sell]: (
            <Confirm data={argProps?.data} onConfirm={argProps?.actionFunction}></Confirm>
          ),
          [action.product.stock]: <Restock args={argProps}></Restock>,
          [action.common.searchuser]: <SearchUser args={argProps}></SearchUser>,
          [action.sale.cart]: <SaleCart args={argProps}></SaleCart>,
          [action.sale.billwarning]: <BillWarning args={argProps}></BillWarning>,
          [action.sale.delete]: <DeleteSale args={argProps}></DeleteSale>,
          [action.common.minimemo]: <MiniMemo args={argProps}></MiniMemo>,
          [action.purchase.cart]: <Cart args={argProps}></Cart>,
          [action.purchase.delete]: <p>coming soon...</p>
        }[openModalId]
      }
    </Template>
  );
}
export default Modal;

type Props = {
  children: React.ReactNode;
  props: any;
};

const Template = ({ children, props }: Props) => {
  const wraperRef = useRef<HTMLDivElement | null>(null);
  const { openModalId, isClosing, closeModal } = useModalStore();
  const [wraperDim, setwraperDim] = useState({
    width: "",
    height: ""
  });

  useEffect(() => {
    /**
     * getting h and w of child element
     * wraper div is just to stop event propagation
     * as it does not have its own dimenstion thats why its child element can not have percenteage dimension
     * defined desried dimention in child as class and get it here to the wraper
     * and set the child h and w to 100%
     */

    if (!wraperRef.current) return;
    const child = wraperRef.current.children[0] as HTMLDivElement;

    child?.classList?.forEach((item) => {
      if (item.includes("js-w")) setwraperDim((prev) => ({ ...prev, width: item.split("-")[2] }));

      if (item.includes("js-h")) setwraperDim((prev) => ({ ...prev, height: item.split("-")[2] }));
    });
  }, []);

  if (!openModalId && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-20 flex cursor-default items-center justify-center bg-gray-500/10 ${openModalId && style.show_modal} ${isClosing && style.hide_modal}`}
      onMouseDown={() => props?.keepFocus || closeModal()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div
        ref={wraperRef}
        className={`min-w-[450px] overscroll-contain rounded-lg border bg-white p-3 shadow-md shadow-gray-200 ${openModalId && style.wraper_show} ${isClosing && style.wraper_hide}`}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: wraperDim.width,
          height: wraperDim.height
        }}
      >
        {children}
      </div>
    </div>
  );
};
