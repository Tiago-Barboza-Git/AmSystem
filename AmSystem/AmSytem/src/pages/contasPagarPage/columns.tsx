import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IContaPagar } from "@/interfaces/contasPagar";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";

interface contasPagarColumnsProps {
  onEdit: (contaPagar: IContaPagar) => void;
  onView: (contaPagar: IContaPagar) => void;
}

export const getContaPagarColumns = ({ onEdit, onView }: contasPagarColumnsProps): ColumnDef<IContaPagar>[] => [
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
            value={row.original.valorParcela as string}
            onChangeValue={() => ""}
            InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
          />
        }
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onView={onView} />,
  },
];
