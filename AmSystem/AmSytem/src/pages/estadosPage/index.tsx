import DataTable from "@/components/datatable";
import { getEstadosColumns } from "./estadosColumns";
import { DeleteEstado, GetEstados } from "./services/queries";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient, UseQueryResult } from "react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog/index.tsx";
import { IEstado } from "@/interfaces/estado.interfaces";
import EstadoForm from "./estadoForm";

interface EstadosPageProps {
  setEstado?: (estado: IEstado) => void;
}

export function EstadosPage({ setEstado }: EstadosPageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedEstado, setSelectedEstado] = useState<IEstado | null>(null);
  const deletePais = DeleteEstado();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetEstados"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((estado: IEstado) => {
    setSelectedEstado(estado);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((estado: IEstado) => {
    setAction("Edit");
    setSelectedEstado(estado);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedEstado(null);
    setOpen(true);
  }, []);

  const estadosQuery = GetEstados(ativos);
  const estados = estadosQuery.data || []; // Ensure paises is an array

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Estados</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <EstadoForm
              action={action}
              isOpen={open}
              estado={selectedEstado}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedEstado(null);
              }}
            />
            <DeleteDialog
              registerId={selectedEstado?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deletePais}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedEstado(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getEstadosColumns({ onEdit, onDelete }), [])}
          data={estados}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setEstado}
        />
      </CardContent>
    </Card>
  );
}
