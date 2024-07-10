import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IParcela } from "@/interfaces/parcela.interfaces";

interface parcelasColumnsProps {
  onEdit: (parcela: IParcela) => void;
  onDelete: (parcela: IParcela) => void;
}

export const getParcelasColumns = ({
  onEdit,
  onDelete,
}: parcelasColumnsProps): ColumnDef<IParcela>[] => [
  {
    accessorKey: "numParcela",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Num. Parcela" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.original.numParcela}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "dias",
    header: "Dias",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "porcentagem",
    header: "Porcentagem",
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
