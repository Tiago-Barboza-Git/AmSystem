import DataTable from "@/components/datatable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { getUnidadesMedidasColumns } from "./columns";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { GetUnidadesMedidas, DeleteUnidadeMedida } from "./services/queries.tsx";
import UnidadeMedidaForm from "./form/index.tsx";

interface UnidadesMedidasPageProps {
  setUnidadeMedida?: (unidadeMedida: IUnidadeMedida | undefined) => void;
}

export function UnidadesMedidasPage({ setUnidadeMedida }: UnidadesMedidasPageProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedUnidadeMedida, setSelectedUnidadeMedida] = useState<IUnidadeMedida | null>(null);
  const [unidadesMedidas, setUnidadesMedidas] = useState<IUnidadeMedida[]>();

  const queryClient = useQueryClient();
  const deleteUnidadeMedida = DeleteUnidadeMedida();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetUnidadesMedidas"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((unidadeMedida: IUnidadeMedida) => {
    setSelectedUnidadeMedida(unidadeMedida);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((unidadeMedida: IUnidadeMedida) => {
    setAction("Edit");
    setSelectedUnidadeMedida(unidadeMedida);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedUnidadeMedida(null);
    setOpen(true);
  }, []);

  const onView = useCallback((unidadeMedida: IUnidadeMedida) => {
    setAction("View");
    setSelectedUnidadeMedida(unidadeMedida);
    setOpen(true);
  }, []);

  // const unidadesMedidasQuery = GetUnidadesMedidas(ativos);
  // const unidadesMedidasData = unidadesMedidasQuery.data || [];

  const unidadesMedidasQuery = GetUnidadesMedidas(ativos);

  useEffect(() => {
    setUnidadesMedidas(unidadesMedidasQuery.data || []);
  }, [unidadesMedidasQuery.data]);

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Unidades de Medida</CardTitle>
        <div className="flex justify-between bg-red-400">
          <div className="bg-red-500 border-red-100">
            <UnidadeMedidaForm
              action={action}
              isOpen={open}
              unidadeMedida={selectedUnidadeMedida}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedUnidadeMedida(null);
              }}
              setUnidadeMedida={setUnidadeMedida}
            />
            <DeleteDialog
              registerId={selectedUnidadeMedida?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteUnidadeMedida}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedUnidadeMedida(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () => getUnidadesMedidasColumns({ onEdit, onDelete: setUnidadeMedida ? undefined : onDelete, onView }),
            [],
          )}
          data={unidadesMedidas}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setUnidadeMedida}
        />
      </CardContent>
    </Card>
  );
}
