import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { insertMaskCNPJ, insertMaskCPF } from "@/functions/masks";
import { iCliente } from "@/interfaces/cliente.interfaces";
import { ColumnDef } from "@tanstack/react-table";

interface clientesColumnsProps {
  onEdit: (cliente: iCliente) => void;
  onDelete?: (cliente: iCliente) => void;
  onView: (cliente: iCliente) => void;
}

export const getClientesColumns = ({ onEdit, onDelete, onView }: clientesColumnsProps): ColumnDef<iCliente>[] => [
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
    accessorKey: "pessoaRazaoSocial",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente/Razão Social" />,
    cell: ({ row }) => (
      <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span>{row.original.pessoaRazaoSocial}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tpCliente",
    header: "Tipo de Pessoa",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div>
        <span>{row.original.tpPessoa === "F" ? "Física" : "Jurídica"}</span>
      </div>
    ),
  },
  {
    accessorKey: "cpfCnpj",
    header: "CPF/CNPJ",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <span>
          {row.original.tpPessoa === "F" ? insertMaskCPF(row.original.cpfCnpj) : insertMaskCNPJ(row.original.cpfCnpj)}
        </span>
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
    cell: ({ row }) => <div>{formatDate(String(row.original.dtAlteracao))}</div>,
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onView={onView} />,
  },
];

export default getClientesColumns;
