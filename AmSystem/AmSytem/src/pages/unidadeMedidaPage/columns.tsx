import { ColumnDef } from "@tanstack/react-table";
// import { iPais } from "@/interfaces/pais.interfaces";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IEstado } from "@/interfaces/estado.interfaces";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";

interface unidadesMedidasColumnsProps {
  onEdit: (unidadeMedida: IUnidadeMedida) => void;
  onDelete: (unidadeMedida: IUnidadeMedida) => void;
  onView: (unidadeMedida: IUnidadeMedida) => void;
}

export const getUnidadesMedidasColumns = ({
  onEdit,
  onDelete,
  onView,
}: unidadesMedidasColumnsProps): ColumnDef<IUnidadeMedida>[] => [
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
    accessorKey: "unidadeMedida",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unidade de Medida" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.unidadeMedida}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "simbolo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Símbolo" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.simbolo}</span>
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
    header: "Ações",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onView={onView} />,
  },
];
