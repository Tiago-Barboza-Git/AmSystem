import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IContaPagar, IPostContaPagar } from "@/interfaces/contasPagar";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";

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
            value={row.original.valorParcela as string}
            onChangeValue={() => ""}
            InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
          />
        }
      </div>
    ),
  },
];
