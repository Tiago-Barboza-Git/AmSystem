import DataTable from "@/components/datatable";
import { getFuncionariosColumns } from "./funcionariosColumns";
import { DeleteFuncionario, GetFuncionarios } from "./services/queries";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog/index.tsx";
import { IFuncionario } from "@/interfaces/funcionario.interfaces";
import FuncionarioForm from "./funcionarioForm";

export function FuncionariosPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<IFuncionario | null>(null);
  const deleteFuncionario = DeleteFuncionario();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetFuncionarios"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((funcionario: IFuncionario) => {
    setSelectedFuncionario(funcionario);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((funcionario: IFuncionario) => {
    setAction("Edit");
    setSelectedFuncionario(funcionario);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedFuncionario(null);
    setOpen(true);
  }, []);

  const funcionariosQuery = GetFuncionarios(ativos);
  const funcionarios = funcionariosQuery.data || []; // Ensure paises is an array

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Funcionários</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <FuncionarioForm
              action={action}
              isOpen={open}
              funcionario={selectedFuncionario}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedFuncionario(null);
              }}
            />
            <DeleteDialog
              registerId={selectedFuncionario?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteFuncionario}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedFuncionario(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () => getFuncionariosColumns({ onEdit, onDelete }),
            []
          )}
          data={funcionarios}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
        />
      </CardContent>
    </Card>
  );
}
