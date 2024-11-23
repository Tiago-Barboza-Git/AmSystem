import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IContaPagar, IPostContaPagar } from "@/interfaces/contasPagar";
// import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import CurrencyInput from "react-currency-input-field";

export const getContaPagarPartColumns = ({}): ColumnDef<IPostContaPagar>[] => [
  {
    accessorKey: "numParcela",
    header: "Parcela",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "idFormaPagamento",
    header: "Cód. Forma Pagamento",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "formaPagamento.formaPagamento",
    header: "Forma Pagamento",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "dataVencimento",
    header: "Dt. Vencimento",
    enableGlobalFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtVencimento))}</div>,
  },
  {
    accessorKey: "valorParcela",
    header: "Valor Parcela",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            prefix="R$ "
            // fixedDecimalLength={2}
            decimalScale={2}
            allowDecimals={true}
            allowNegativeValue={false}
            disabled={true}
            // onChange={(value) => {
            //   field.onChange(String(value.target.value));
            // }}
            value={row.original.valorParcela as string}
          />
        }
      </div>
    ),
  },
];
