import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/functions/masks";

interface produtosCompraColumnsProps {
  onEdit: (produtoCompra: IProdutoCompra) => void;
  onDelete: (produtoCompra: IProdutoCompra, index: number) => void;
  action?: string;
}

export const getProdutosCompraColumns = ({
  onEdit,
  onDelete,
  action,
}: produtosCompraColumnsProps): ColumnDef<IProdutoCompra>[] => {
  const columns: ColumnDef<IProdutoCompra>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cód. " />,
      cell: ({ row }) => (
        <div>
          <span>{row.original.produto.id}</span>
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "produto.produto",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produto" />,
      cell: ({ row }) => (
        <div>
          <span>{row.original.produto.produto}</span>
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "produto.unidadeMedida.unidadeMedida",
      header: "Un. Med.",
      enableGlobalFilter: false,
    },
    {
      accessorKey: "quantidade",
      header: "Quantidade",
      enableGlobalFilter: false,
    },
    {
      accessorKey: "precoUnit",
      header: "Preço Unit.",
      cell: ({ row }) => (
        <div>
          {
            <CurrencyInput
              value={row.original.precoUnit as string}
              onChangeValue={() => ""}
              InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
            />
          }
        </div>
      ),
      enableGlobalFilter: false,
    },
    {
      accessorKey: "precoTotal",
      header: "Preço Total",
      cell: ({ row }) => {
        const precoTotal =
          (row.original.quantidade || 0) * ((formatCurrency(row.original.precoUnit.toString()) as number) || 0);
        return (
          <div>
            {
              <CurrencyInput
                value={precoTotal}
                onChangeValue={() => ""}
                InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
              />
            }
          </div>
        );
      },
      enableGlobalFilter: false,
    },
  ];

  // Adiciona a coluna de ações se `disabled` for falso
  if (action !== "View") {
    columns.push({
      header: "Ações",
      id: "100",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    });
  }

  return columns;
};
