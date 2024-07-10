import DataTable from "@/components/datatable";
import { getPaisesColumns } from "./paisesColumns";
import { DeletePais, GetPaises } from "./services/queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IPais } from "@/interfaces/pais.interfaces";
import { useQueryClient, UseQueryResult } from "react-query";
import PaisForm from "./paisForm/index.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog/index.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

interface PaisesPageProps {
  setPais?: (pais: IPais) => void;
}

export const PaisesPage = ({ setPais }: PaisesPageProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectPais, setSelectPais] = useState<IPais | null>(null);
  const deletePais = DeletePais();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetPaises"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((pais: IPais) => {
    setSelectPais(pais);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((pais: IPais) => {
    setAction("Edit");
    setSelectPais(pais);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectPais(null);
    setOpen(true);
  }, []);

  const paisesQuery = GetPaises(ativos);
  const paises = paisesQuery.data || []; // Ensure paises is an array

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Países</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <PaisForm
              action={action}
              setOpen={setOpen}
              pais={selectPais}
              isOpen={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectPais(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getPaisesColumns({ onEdit, onDelete }), [])}
          data={paises}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setPais}
        />
      </CardContent>
    </Card>
  );
};
