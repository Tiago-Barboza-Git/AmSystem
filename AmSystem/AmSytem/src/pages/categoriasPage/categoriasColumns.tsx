import { ColumnDef } from "@tanstack/react-table";
// import { iPais } from "@/interfaces/pais.interfaces";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IEstado } from "@/interfaces/estado.interfaces";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { ICategoria } from "@/interfaces/categoria.interfaces";

interface categoriasColumnsProps {
  onEdit: (categoria: ICategoria) => void;
  onDelete: (categoria: ICategoria) => void;
}

export const getCategoriasColumns = ({
  onEdit,
  onDelete,
}: categoriasColumnsProps): ColumnDef<ICategoria>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cód. " />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.original.id}</span>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.original.categoria}</span>
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
    cell: ({ row }) => (
      <div>{formatDate(String(row.original.dtAlteracao))}</div>
    ),
  },
  {
    header: "Ações",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
