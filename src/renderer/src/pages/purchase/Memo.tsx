import { bdt } from "@/lib/utils"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Printer } from "lucide-react"
import { useRef } from "react"

const Memo = ({ saleData }) => {
  const { products, supplier, serial, poNum, chalanNum, billingDate, paid, paymentOption } =
    saleData

  const billAmount = products?.reduce((acc, curr) => acc + curr.quantity * curr.rate, 0)
  const prevDue = supplier?.totalSale - supplier?.totalPaid || 0

  const pdfRef = useRef<HTMLDivElement | null>(null)

  const printInvoice = async () => {
    const element = pdfRef.current
    if (!element) return
    const canvas = await html2canvas(element, {
      scale: 3, // Higher quality
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL("image/png")

    // const link = document.createElement("a")
    // link.download = `image.png`
    // link.href = imgData
    // link.click()

    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`Invoice-${serial ? serial + "-" + supplier?.name : "random"}.pdf`)
  }
  return (
    <div>
      <div className={`p-12`} ref={pdfRef}>
        <h2 className={`mb-8 text-center text-base font-medium`}>{supplier?.identifier}</h2>

        <div className={`flex justify-between gap-x-16`}>
          <div className={`w-1/2`}>
            <div className={`flex`}>
              <p className={`w-[50%]`}>Bill number </p>
              <p className={`before:mr-1 before:content-[':']`}>
                {supplier ? `${serial}-${supplier.name.toLowerCase()}-${supplier.identifier.toLowerCase()}` : serial}
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

      <div className={`absolute right-14 bottom-6 flex items-center gap-x-2`}>
        <button
          className={`h-8 cursor-pointer rounded border border-blue-400 px-4 text-blue-600`}
          onClick={() => printInvoice()}
        >
          <Printer className={`h-4 w-4`}></Printer>
        </button>
      </div>
    </div>
  )
}

export default Memo
