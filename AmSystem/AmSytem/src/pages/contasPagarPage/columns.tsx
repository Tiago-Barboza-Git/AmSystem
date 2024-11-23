import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IContaPagar } from "@/interfaces/contasPagar";
import CurrencyInput from "react-currency-input-field";
import { Input } from "@/components/ui/input";
import InputMoney from "@/components/form/inputMoney";
import { Circle, CircleCheck, CircleX, X } from "lucide-react";

interface contasPagarColumnsProps {
  onPagar: (contaPagar: IContaPagar) => void;
  onView: (contaPagar: IContaPagar) => void;
  onCancel: (contaPagar: IContaPagar) => void;
}

export const getContaPagarColumns = ({
  onPagar,
  onView,
  onCancel,
}: contasPagarColumnsProps): ColumnDef<IContaPagar>[] => [
  {
    accessorKey: "numParcela",
    header: "Parcela",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "nrNota",
    header: "Nr. Nota",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "nrModelo",
    header: "Nr. Modelo",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "nrSerie",
    header: "Nr. Série",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "idFornecedor",
    header: "Id Fornecedor",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "fornecedor.pessoaRazaoSocial",
    header: "Fornecedor",
    enableGlobalFilter: true,
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
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            prefix="R$ "
            decimalScale={2}
            allowDecimals={true}
            allowNegativeValue={false}
            disabled={true}
            value={row.original.valorParcela}
          />
        }
      </div>
    ),
  },
  {
    accessorKey: "valorPago",
    header: "Valor Pago",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            prefix="R$ "
            decimalScale={2}
            allowDecimals={true}
            allowNegativeValue={false}
            disabled={true}
            value={row.original.valorPago}
          />
        }
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <div>
        {row.original.cancelada === false ? (
          <span>
            {Number(row.original.valorPago) > 0 ? (
              <Circle color="green" fill="green" size={20} />
            ) : (
              <Circle color="orange" fill="orange" size={20} />
            )}
          </span>
        ) : (
          <span>
            <Circle color="red" fill="red" size={20} />
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return row.original.cancelada || row.original.valorPago > 0 ? (
        <DataTableRowActions row={row} onView={onView} />
      ) : row.original.avulsa ? (
        <DataTableRowActions row={row} onCancel={onCancel} />
      ) : (
        <DataTableRowActions row={row} onView={onView} onPagar={onPagar} />
      );
    },
  },
];
