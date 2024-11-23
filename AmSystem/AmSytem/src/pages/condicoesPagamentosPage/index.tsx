import DataTable from "@/components/datatable";
import { getCondicoesPagamentosColumns } from "./condicoesPagamentosColumns";
import { DeleteCondicaoPagamento, GetCondicoesPagamentos } from "./services/queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient, UseQueryResult } from "react-query";
// import PaisForm from "./paisForm/index.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog";
import CondicaoPagamentoForm from "./form";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
("./form/index");

interface CondicoesPagamentosProps {
  setCondicaoPagamento?: (condicaoPagamento: ICondicaoPagamento) => void;
}

export function CondicoesPagamentosPage({ setCondicaoPagamento }: CondicoesPagamentosProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedCondicaoPagamento, setSelectedCondicaoPagamento] = useState<ICondicaoPagamento | null>(null);
  const deleteCondicao = DeleteCondicaoPagamento();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetCidades"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((condicaoPagamento: ICondicaoPagamento) => {
    setSelectedCondicaoPagamento(condicaoPagamento);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((condicaoPagamento: ICondicaoPagamento) => {
    setAction("Edit");
    setSelectedCondicaoPagamento(condicaoPagamento);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedCondicaoPagamento(null);
    setOpen(true);
  }, []);

  const onView = useCallback((condicaoPagamento: ICondicaoPagamento) => {
    setAction("View");
    setSelectedCondicaoPagamento(condicaoPagamento);
    setOpen(true);
  }, []);

  const condicoesPagamentosQuery = GetCondicoesPagamentos(ativos);
  const condicoesPagamentos = condicoesPagamentosQuery.data || []; // Ensure paises is an array

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Condições de Pagamentos</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <CondicaoPagamentoForm
              action={action}
              isOpen={open}
              condicaoPagamento={selectedCondicaoPagamento}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedCondicaoPagamento(null);
              }}
              setCondicaoPagamento={setCondicaoPagamento}
            />
            <DeleteDialog
              registerId={selectedCondicaoPagamento?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteCondicao}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedCondicaoPagamento(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () =>
              getCondicoesPagamentosColumns({ onEdit, onDelete: setCondicaoPagamento ? undefined : onDelete, onView }),
            [],
          )}
          data={condicoesPagamentos}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setCondicaoPagamento}
        />
      </CardContent>
    </Card>
  );
}
