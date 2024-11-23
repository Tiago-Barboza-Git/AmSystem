import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IProduto } from "@/interfaces/produto.interfaces";
import CurrencyInput from "react-currency-input-field";
import { Input } from "@/components/ui/input";
import InputMoney from "@/components/form/inputMoney";

interface produtosColumnsProps {
  onEdit: (produto: IProduto) => void;
  onDelete?: (produto: IProduto) => void;
  onView: (produto: IProduto) => void;
}

export const getProdutosColumns = ({ onEdit, onDelete, onView }: produtosColumnsProps): ColumnDef<IProduto>[] => [
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
    accessorKey: "produto",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Produto" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.produto}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "precoVenda",
    header: "PrecoVenda",
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            prefix="R$ "
            decimalScale={2}
            allowDecimals={true}
            allowNegativeValue={false}
            disabled={true}
            groupSeparator="."
            decimalSeparator=","
            value={row.original.precoVenda}
          />
        }
      </div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "precoUltCompra",
    header: "Preço Ult. Compra",
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            prefix="R$ "
            decimalScale={2}
            allowDecimals={true}
            allowNegativeValue={false}
            groupSeparator="."
            decimalSeparator=","
            disabled={true}
            value={row.original.precoUltCompra}
          />
        }
      </div>
    ),
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
