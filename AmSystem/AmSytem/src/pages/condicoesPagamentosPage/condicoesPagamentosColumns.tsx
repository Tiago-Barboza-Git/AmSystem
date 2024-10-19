import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";

interface condicoesPagamentosColumnsProps {
  onEdit: (condicaoPagamento: ICondicaoPagamento) => void;
  onDelete: (condicaoPagamento: ICondicaoPagamento) => void;
  onView: (condicaoPagamento: ICondicaoPagamento) => void;
}

export const getCondicoesPagamentosColumns = ({
  onEdit,
  onDelete,
  onView,
}: condicoesPagamentosColumnsProps): ColumnDef<ICondicaoPagamento>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cód. " />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.id}</span>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "condicaoPagamento",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Condição de Pagamento" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.condicaoPagamento}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "desconto",
    header: "Desconto (%)",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "juros",
    header: "Juros (%)",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "multa",
    header: "Multa (%)",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "dtCadastro",
    header: "Dt. Cadastro",
    enableGlobalFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtCadastro))}</div>,
  },
  {
    accessorKey: "dtAlteracao",
    header: "Dt. Alteração",
    enableColumnFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtAlteracao))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onView={onView} />,
  },
];
