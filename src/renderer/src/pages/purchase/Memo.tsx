import { bdt } from "@/lib/utils";

const Memo = ({ purchaseData, pdfRef }) => {
  const { products, supplier, serial, poNum, chalanNum, billingDate, paid, paymentOption } =
    purchaseData;

  const billAmount = products?.reduce((acc, curr) => acc + curr.quantity * curr.rate, 0) || 0;
  const prevDue = supplier?.totalSale - supplier?.totalPaid || 0;

  return (
    <div>
      <div className={`p-12`} ref={pdfRef}>
        <h2 className={`mb-8 text-center text-base font-medium`}>{supplier?.identifier}</h2>

        <div className={`flex justify-between gap-x-16`}>
          <div className={`w-1/2`}>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Bill number </p>
              <p className={`before:mr-1 before:content-[':']`}>
                {supplier
                  ? `${serial}-${supplier.name.toLowerCase()}-${supplier.identifier.toLowerCase()}`
                  : serial}
              </p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Supplier name </p>
              <p className={`before:mr-1 before:content-[':']`}>{supplier?.name}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Adress </p>
              <p className={`before:mr-1 before:content-[':']`}>{supplier?.address}</p>
            </div>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Phone </p>
              <p className={`before:mr-1 before:content-[':']`}>{supplier?.phone}</p>
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
        <div className={`mt-4 h-[450px] border-t border-dotted border-[#364153] pt-4`}>
          <table className={`w-full border`}>
            <thead>
              <tr className={`border-b border-black`}>
                <th className={`p-1`}>SL</th>
                <th className={`border-l border-black p-1`}>Product Name</th>
                <th className={`border-l border-black p-1`}>Brand</th>
                <th className={`border-l border-black p-1`}>Qty</th>
                <th className={`border-l border-black p-1`}>Unit</th>
                <th className={`border-l border-black p-1`}>Rate</th>
                <th className={`border-l border-black p-1`}>Total</th>
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
      </div>
    </div>
  );
};

export default Memo;
