import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/functions/masks";
import CurrencyInput from "react-currency-input-field";

interface produtosCompraColumnsProps {
  onEdit?: (produtoCompra: IProdutoCompra) => void;
  onDelete: (produtoCompra: IProdutoCompra, index: number) => void;
  actionPai?: string;
  activedStep?: number;
}

export const getProdutosCompraColumns = ({
  onEdit,
  onDelete,
  actionPai,
  activedStep,
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
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              prefix="R$ "
              decimalScale={2}
              allowDecimals={true}
              allowNegativeValue={false}
              disabled={true}
              value={row.original.precoUnit}
            />
          }
        </div>
      ),
      enableGlobalFilter: false,
    },
    {
      accessorKey: "desconto",
      header: "Desconto",
      cell: ({ row }) => (
        <div>
          {
            <CurrencyInput
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              prefix="R$ "
              decimalScale={2}
              allowDecimals={true}
              allowNegativeValue={false}
              disabled={true}
              value={row.original.desconto}
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                prefix="R$ "
                decimalScale={2}
                allowDecimals={true}
                allowNegativeValue={false}
                disabled={true}
                value={row.original.precoTotal}
              />
            }
          </div>
        );
      },
      enableGlobalFilter: false,
    },
  ];

  // Adiciona a coluna de ações se `disabled` for falso
  if (activedStep === 1) {
    columns.push({
      header: "Ações",
      id: "100",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    });
  }

  return columns;
};
