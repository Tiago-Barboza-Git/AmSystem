import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { insertMaskCNPJ, insertMaskCPF } from "@/functions/masks";
import { IFuncionario } from "@/interfaces/funcionario.interfaces";
import { ColumnDef } from "@tanstack/react-table";

interface funcionariosColumnsProps {
  onEdit: (funcionario: IFuncionario) => void;
  onDelete: (funcionario: IFuncionario) => void;
}

export const getFuncionariosColumns = ({
  onEdit,
  onDelete,
}: funcionariosColumnsProps): ColumnDef<IFuncionario>[] => [
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
    accessorKey: "funcionario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionário" />
    ),
    cell: ({ row }) => (
      <div>
        <span>{row.original.funcionario}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "cpfCnpj",
    header: "CPF/CNPJ",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <span>{insertMaskCPF(row.original.cpf)}</span>
      </div>
    ),
  },
  {
    accessorKey: "cidade.cidade",
    header: "Cidade",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "dtCadastro",
    header: "Dt. Cadastro",
    cell: ({ row }) => <div>{formatDate(String(row.original.dtCadastro))}</div>,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "dtAlteracao",
    header: "Dt. Alteração",
    cell: ({ row }) => (
      <div>{formatDate(String(row.original.dtAlteracao))}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];

export default getFuncionariosColumns;
