import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { ICompra } from "@/interfaces/compra.interfaces";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import { Circle, CircleCheck, CircleX } from "lucide-react";

interface comprasColumnsProps {
  onView: (compra: ICompra) => void;
  onCancel: (compra: ICompra) => void;
}

export const getComprasColumns = ({ onView, onCancel }: comprasColumnsProps): ColumnDef<ICompra>[] => [
  {
    accessorKey: "nrNota",
    header: "Nr. Nota",
    cell: ({ row }) => (
      <div>
        <span>{row.original.nrNota}</span>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "nrModelo",
    header: "Nr. Modelo",
    cell: ({ row }) => (
      <div>
        <span>{row.original.nrModelo}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "nrSerie",
    header: "Nr. Série",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "fornecedor.pessoaRazaoSocial",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fornecedor" />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "dtEmissao",
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dt. Emissão" />,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtEmissao))}</div>,
  },
  {
    accessorKey: "dtCadastro",
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dt. Cadastro" />,
    cell: ({ row }) => <div>{formatDate(String(row.original.dtCadastro))}</div>,
  },
  {
    accessorKey: "totalCompra",
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Compra" />,
    cell: ({ row }) => (
      <div>
        {
          <CurrencyInput
            value={row.original.totalNota}
            onChangeValue={() => ""}
            InputElement={<Input disabled className="bg-transparent border-none shadow-none disabled:!text-red" />}
          />
        }
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <div>
        {row.original.dtCancelamento === null ? (
          <span>
            {row.original.contasPagar.every((conta) => Number(conta.valorPago) > 0) ? (
              <Circle color="green" fill="green" size={20} />
            ) : (
              <Circle color="orange" fill="orange" size={20} />
            )}
          </span>
        ) : (
          <span>
            <Circle color="red" fill="red" size={20} />
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row}
          onView={onView}
          onCancel={
            row.original.contasPagar.some((conta) => Number(conta.valorPago) > 0) ||
            row.original.dtCancelamento !== null
              ? undefined
              : onCancel
          }
        />
      );
    },
  },
];
