import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { ICompra } from "@/interfaces/compra.interfaces";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";

interface comprasColumnsProps {
  onView: (compra: ICompra) => void;
  onCancel: (compra: ICompra) => void;
}

export const getComprasColumns = ({ onView, onCancel }: comprasColumnsProps): ColumnDef<ICompra>[] => [
  {
    accessorKey: "nrNota",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nr. Nota" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.nrNota}</span>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "nrModelo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nr. Modelo" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.nrModelo}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "nrSerie",
    header: "Nr. Série",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "fornecedor.pessoaRazaoSocial",
    header: "Fornecedor",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "dtEmissao",
    header: "Dt. Emissão",
    enableGlobalFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtEmissao))}</div>,
  },
  {
    accessorKey: "dtCadastro",
    header: "Dt. Cadastro",
    enableGlobalFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtCadastro))}</div>,
  },
  {
    accessorKey: "totalCompra",
    header: "Total Compra",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            value={row.original.totalCompra as string}
            onChangeValue={() => ""}
            InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
          />
        }
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onView={onView} onCancel={onCancel} />,
  },
];
