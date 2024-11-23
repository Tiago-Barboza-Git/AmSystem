import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";

interface formasPagamentosColumnsProps {
  onEdit: (formaPagamento: IFormaPagamento) => void;
  onDelete?: (formaPagamento: IFormaPagamento) => void;
  onView: (formaPagamento: IFormaPagamento) => void;
}

export const getFormasPagamentosColumns = ({
  onEdit,
  onDelete,
  onView,
}: formasPagamentosColumnsProps): ColumnDef<IFormaPagamento>[] => [
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
    accessorKey: "formaPagamento",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Forma de Pagamento" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.formaPagamento}</span>
      </div>
    ),
    enableGlobalFilter: true,
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
