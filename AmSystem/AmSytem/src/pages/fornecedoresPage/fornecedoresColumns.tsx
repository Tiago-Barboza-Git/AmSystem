import DataTableColumnHeader from "@/components/datatable/dataTableColumnHeader";
import { DataTableRowActions } from "@/components/datatable/dataTableRowActions";
import { formatDate } from "@/functions/functions";
import { insertMaskCNPJ, insertMaskCPF } from "@/functions/masks";
import { iCliente } from "@/interfaces/cliente.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { ColumnDef } from "@tanstack/react-table";

interface fornecedoresColumnsProps {
  onEdit: (cliente: IFornecedor) => void;
  onDelete: (cliente: IFornecedor) => void;
  onView: (cliente: IFornecedor) => void;
}

export const getFornecedoresColumns = ({
  onEdit,
  onDelete,
  onView,
}: fornecedoresColumnsProps): ColumnDef<IFornecedor>[] => [
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
    accessorKey: "fornecedorRazaoSocial",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fornecedor/Razão Social" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.pessoaRazaoSocial}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tpFornecedor",
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

export default getFornecedoresColumns;
