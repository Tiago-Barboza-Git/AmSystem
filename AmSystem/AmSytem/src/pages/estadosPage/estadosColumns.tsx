import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IEstado } from "@/interfaces/estado.interfaces";

interface estadosColumnsProps {
  onEdit: (estado: IEstado) => void;
  onDelete?: (estado: IEstado) => void;
  onView: (estado: IEstado) => void;
}

export const getEstadosColumns = ({ onEdit, onDelete, onView }: estadosColumnsProps): ColumnDef<IEstado>[] => [
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
    accessorKey: "estado",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.estado}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "uf",
    header: "UF",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "pais.pais",
    header: "País",
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
