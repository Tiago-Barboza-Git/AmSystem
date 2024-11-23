import DataTable from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteCliente, GetClientes } from "./services/queries";
import DeleteDialog from "@/components/dialog/deleteDialog/index.tsx";
import { useQueryClient } from "react-query";
import { useCallback, useMemo, useState } from "react";
import { iCliente } from "@/interfaces/cliente.interfaces";
import getClientesColumns from "./clienteColumns";
import ClienteForm from "./clienteForm/index.tsx";

interface clientesPageProps {
  setCliente?: (fornecedor: iCliente) => void;
}

export function ClientesPage({ setCliente }: clientesPageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedCliente, setSelectedCliente] = useState<iCliente | null>(null);
  const deleteCliente = DeleteCliente();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetClientes");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((cliente: iCliente) => {
    setSelectedCliente(cliente);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((cliente: iCliente) => {
    setAction("Edit");
    setSelectedCliente(cliente);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedCliente(null);
    setOpen(true);
  }, []);

  const onView = useCallback((cliente: iCliente) => {
    setAction("View");
    setSelectedCliente(cliente);
    setOpen(true);
  }, []);

  const clientesQuery = GetClientes(ativos);
  const clientes = clientesQuery.data || []; // Ensure paises is an array

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <ClienteForm
              action={action}
              cliente={selectedCliente}
              isOpen={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedCliente(null);
              }}
              setCliente={setCliente}
            />
            <DeleteDialog
              registerId={selectedCliente?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteCliente}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedCliente(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () => getClientesColumns({ onEdit, onDelete: setCliente ? undefined : onDelete, onView }),
            [],
          )}
          data={clientes}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setCliente}
        />
      </CardContent>
    </Card>
  );
}
