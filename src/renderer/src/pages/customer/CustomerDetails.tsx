import { bdt } from "@/lib/utils";
import { useModalStore, useSaleStore } from "@/store";
import { TCustomer, TSale } from "@shared/models";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { X } from "lucide-react";

const CustomerDetails = ({ args }) => {
  const { customer }: { customer: TCustomer } = args;
  const { sales } = useSaleStore();
  const salesByCustomer = sales.filter((sale) => sale.customerId === customer.id);

  const columns: ColumnDef<TSale>[] = [
    {
      id: "billingDate",
      header: "Bill Date",
      accessorFn: ({ billingDate }) => billingDate
    },
    {
      id: "products",
      header: "Products",
      accessorFn: ({ products }) => products, // Keep the raw array
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.products?.map((product, index) => (
            <div key={index} className="text-sm">
              <span>{product.name}</span>
              <span>{product.size}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "billAmount",
      header: "Total Amount",
      accessorFn: ({ billAmount }) => billAmount
    },
    {
      id: "paid",
      header: "Paid",
      accessorFn: ({ paid }) => paid
    },
    {
      id: "due",
      header: "Due",
      accessorFn: ({ paid, billAmount }) => billAmount - paid
    },
    {
      id: "method",
      header: "Gateway",
      accessorFn: ({ paymentOption }) => paymentOption.join(", ")
    }
  ];
  return (
    <div className={`h-[calc(80vh-2%)] w-[calc(80vw)] p-4`}>
      <button
        className={`absolute top-4 right-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-50`}
        onClick={useModalStore.getState().closeModal}
      >
        <X className={`h-4 w-4 text-blue-600`}></X>
      </button>

      <h2 className={`text-lg font-medium`}>
        {customer.name} {customer.identifier}
      </h2>
      <h3>
        {customer.address}, {customer.phone}
      </h3>

      <DataTable columns={columns} data={salesByCustomer} />

      <div className={`mt-3 flex w-[250px]`}>
        <p className={`w-1/2`}>Total Purchase</p>
        <p className={`text-blue-600 before:mr-1 before:content-[':']`}>
          {bdt(customer.totalPurchase)}
        </p>
      </div>
      <div className={`flex w-[250px]`}>
        <p className={`w-1/2`}>Total Paid</p>
        <p className={`text-blue-600 before:mr-1 before:content-[':']`}>
          {bdt(customer.totalPaid)}
        </p>
      </div>
    </div>
  );
};

function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div className={`mt-4 h-[550px] overflow-y-auto rounded border`}>
      <table className={`w-full`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={`h-9 border-b text-left`}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={`pl-2`}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <tr key={row.id} className={`h-9 border-b ${idx % 2 === 0 && "bg-gray-50"}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={`p-2`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td>No results</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default CustomerDetails;
