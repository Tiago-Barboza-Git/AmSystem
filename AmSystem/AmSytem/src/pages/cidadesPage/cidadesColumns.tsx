import { ColumnDef } from "@tanstack/react-table";
// import { iPais } from "@/interfaces/pais.interfaces";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IEstado } from "@/interfaces/estado.interfaces";
import { ICidade } from "@/interfaces/cidade.interfaces";

interface cidadesColumnsProps {
  onEdit: (cidade: ICidade) => void;
  onDelete?: (cidade: ICidade) => void;
  onView: (cidade: ICidade) => void;
}

export const getCidadesColumns = ({ onEdit, onDelete, onView }: cidadesColumnsProps): ColumnDef<ICidade>[] => [
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
    accessorKey: "cidade",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cidade" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.cidade}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "ddd",
    header: "DDD",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "estado.uf",
    header: "UF",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "estado.pais.pais",
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
    header: "Ações",
    id: "100",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onView={onView} />,
  },
];
