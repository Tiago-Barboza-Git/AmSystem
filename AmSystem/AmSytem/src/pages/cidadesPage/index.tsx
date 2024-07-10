import DataTable from "@/components/datatable";
import { getCidadesColumns } from "./cidadesColumns";
import { DeleteCidade, GetCidades } from "./services/queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient, UseQueryResult } from "react-query";
// import PaisForm from "./paisForm/index.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog/index.tsx";
import { ICidade } from "@/interfaces/cidade.interfaces";
import CidadeForm from "./cidadeForm";

interface CidadesPageProps {
  setCidade?: (cidade: ICidade) => void;
}

export function CidadesPage({ setCidade }: CidadesPageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedCidade, setSelectedCidade] = useState<ICidade | null>(null);
  const deleteCidade = DeleteCidade();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetCidades"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((cidade: ICidade) => {
    setSelectedCidade(cidade);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((cidade: ICidade) => {
    setAction("Edit");
    setSelectedCidade(cidade);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedCidade(null);
    setOpen(true);
  }, []);

  const cidadesQuery = GetCidades(ativos);
  const cidades = cidadesQuery.data || []; // Ensure paises is an array

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Cidades</CardTitle>
        <div className="flex justify-between bg-red-400">
          <div className="bg-red-500 border-red-100">
            <CidadeForm
              action={action}
              isOpen={open}
              cidade={selectedCidade}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedCidade(null);
              }}
            />
            <DeleteDialog
              registerId={selectedCidade?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteCidade}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedCidade(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getCidadesColumns({ onEdit, onDelete }), [])}
          data={cidades}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setCidade}
        />
      </CardContent>
    </Card>
  );
}
