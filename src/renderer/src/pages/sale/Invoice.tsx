import { bdt } from "@/lib/utils";
import icon from "../../assets/icon.png";

const Invoice = ({ saleData, pdfRef }) => {
  const { products, customer, serial, poNum, chalanNum, billingDate, paid, paymentOption } =
    saleData;

  const billAmount = products?.reduce((acc, curr) => acc + curr.rate * curr.quantity, 0) || 0;
  const prevDue = customer?.totalPurchase - customer?.totalPaid || 0;

  return (
    <div>
      <div className={`p-12`} ref={pdfRef}>
        <img src={icon} className={`absolute h-6 w-6`} alt="logo" />
        <h2 className={`text-center text-lg font-medium`}>Apex Trading Co.</h2>
        <p className={`mb-8 text-center`}>72 B.C.C Road, Wari, Dhaka</p>

        <div className={`flex justify-between gap-x-16`}>
          <div className={`w-1/2`}>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Bill number </p>
              <p className={`before:mr-1 before:content-[':']`}>
                {customer
                  ? `${serial}-${customer.name.toLowerCase()}-${customer.identifier.toLowerCase()}`
                  : serial}
              </p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Customer name </p>
              <p className={`before:mr-1 before:content-[':']`}>{customer?.name}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Adress</p>
              <p className={`before:mr-1 before:content-[':']`}>{customer?.address}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Phone </p>
              <p className={`before:mr-1 before:content-[':']`}>{customer?.phone}</p>
            </div>
          </div>

          <div className={`w-1/2`}>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Bill Date </p>
              <p className={`before:mr-1 before:content-[':']`}>{billingDate}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>PO Number </p>
              <p className={`before:mr-1 before:content-[':']`}>{poNum}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Chalan Number </p>
              <p className={`before:mr-1 before:content-[':']`}>{chalanNum}</p>
            </div>
          </div>
        </div>
        <div className={`mt-4 h-[450px] border-t border-dashed border-[#7c7c7c] pt-4`}>
          <table className={`w-full border`}>
            <thead>
              <tr className={`border-b border-black`}>
                <th className={`p-1`}>SL</th>
                <th className={`border-l border-black p-1`}>Product Name</th>
                <th className={`border-l border-black p-1`}>Brand</th>
                <th className={`border-l border-black p-1`}>Qty</th>
                <th className={`border-l border-black p-1`}>Unit</th>
                <th className={`border-l border-black p-1`}>Rate</th>
                <th className={`border-l border-black p-1`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr key={product.productId} className={`border-b border-black`}>
                  <td className={`p-1`}>{index + 1}</td>
                  <td className={`border-l border-black p-1`}>
                    {product.name} {product.size}
                  </td>
                  <td className={`border-l border-black p-1`}>{product.brand}</td>
                  <td className={`border-l border-black p-1`}>{product.quantity}</td>
                  <td className={`border-l border-black p-1`}>{product.unit}</td>
                  <td className={`border-l border-black p-1`}>{bdt(product.rate)}</td>
                  <td className={`border-l border-black p-1`}>
                    {bdt(product.quantity * product.rate)}
                  </td>
                </tr>
              ))}
              <tr className={`border-b border-black`}>
                <td></td>
                <td className={`border-l border-black p-1`}>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={`p-1`}>{billAmount}</td>
              </tr>
              <tr className={`border-b border-black`}>
                <td></td>
                <td className={`border-l border-black p-1`}>Previous Due</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={`p-1`}>{prevDue}</td>
              </tr>

              <tr className={`border-b border-black`}>
                <td></td>
                <td className={`border-l border-black p-1`}>Payment({paymentOption.join(", ")})</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={`p-1`}>{paid}</td>
              </tr>

              <tr>
                <td></td>
                <td className={`border-l border-black p-1`}>Latest Due</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={`p-1`}>{prevDue + billAmount - paid}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`relative`}>
          <p className={`mt-4 w-fit border-t border-[#a7a7a7] px-4`}>Apex Trading Authorized</p>
        </div>
      </div>

      {/* <button
        className={`absolute right-14 bottom-6 h-8 cursor-pointer rounded border border-blue-400 px-4 text-blue-600`}
        onClick={() => {
          billCreated
            ? printInvoice()
            : useModalStore.getState().openModal(action.sale.billwarning, { printInvoice });
        }}
      >
        <Printer className={`h-4 w-4`}></Printer>
      </button> */}
    </div>
  );
};

export default Invoice;
