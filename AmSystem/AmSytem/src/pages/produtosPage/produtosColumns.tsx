import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { IProduto } from "@/interfaces/produto.interfaces";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";

interface produtosColumnsProps {
  onEdit: (produto: IProduto) => void;
  onDelete: (produto: IProduto) => void;
}

export const getProdutosColumns = ({
  onEdit,
  onDelete,
}: produtosColumnsProps): ColumnDef<IProduto>[] => [
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
    accessorKey: "produto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produto" />
    ),
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
            value={row.original.precoVenda as string}
            onChangeValue={() => ""}
            InputElement={
              <Input
                disabled
                className="bg-transparent border-none shadow-none disabled:!text-red"
              />
            }
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
            value={row.original.precoUltCompra as string}
            onChangeValue={() => ""}
            InputElement={
              <Input
                disabled
                className="bg-transparent border-none shadow-none disabled:!text-red"
              />
            }
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
    cell: ({ row }) => (
      <div>{formatDate(String(row.original.dtAlteracao))}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
