import DataTable from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { useQueryClient } from "react-query";
import { useCallback, useMemo, useState } from "react";
import { iCliente } from "@/interfaces/cliente.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces.tsx";
import {
  GetFornecedoresRequest,
  PutFornecedorRequest,
} from "./services/api.tsx";
import { DeleteFornecedor, GetFornecedores } from "./services/queries.tsx";
import getFornecedoresColumns from "./fornecedoresColumns.tsx";
import FornecedorForm from "./fornecedorForm/index.tsx";

export function FornecedoresPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedFornecedor, setSelectedFornecedor] =
    useState<IFornecedor | null>(null);
  const deleteFornecedor = DeleteFornecedor();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetFornecedores");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((fornecedor: IFornecedor) => {
    setSelectedFornecedor(fornecedor);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((fornecedor: IFornecedor) => {
    setAction("Edit");
    setSelectedFornecedor(fornecedor);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedFornecedor(null);
    setOpen(true);
  }, []);

  const fornecedoresQuery = GetFornecedores(ativos);
  const fornecedores = fornecedoresQuery.data || []; // Ensure paises is an array

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fornecedores</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <FornecedorForm
              action={action}
              fornecedor={selectedFornecedor}
              isOpen={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedFornecedor(null);
              }}
            />
            <DeleteDialog
              registerId={selectedFornecedor?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteFornecedor}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedFornecedor(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () => getFornecedoresColumns({ onEdit, onDelete }),
            []
          )}
          data={fornecedores}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
        />
      </CardContent>
    </Card>
  );
}
