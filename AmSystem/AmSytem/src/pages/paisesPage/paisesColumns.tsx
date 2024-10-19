import { ColumnDef } from "@tanstack/react-table";
import { IPais } from "@/interfaces/pais.interfaces";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";

interface paisesColumnsProps {
  onEdit: (pais: IPais) => void;
  onDelete: (pais: IPais) => void;
  onView: (pais: IPais) => void;
}

export const getPaisesColumns = ({ onEdit, onDelete, onView }: paisesColumnsProps): ColumnDef<IPais>[] => [
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
    accessorKey: "pais",
    header: ({ column }) => <DataTableColumnHeader column={column} title="País" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.pais}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "ddi",
    header: "DDI",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "sigla",
    header: "Sigla",
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
    enableGlobalFilter: false,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtAlteracao))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onView={onView} />,
  },
];

// id: number;
// pais: string;
// ddi: number;
// sigla: string;
// ativo: boolean;
// dtCadastro?: Date | string;
// dtAlteracao?: Date | string;
