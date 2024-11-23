import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { DeleteFormaPagamento, GetFormasPagamentos } from "./services/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "@/components/dialog/deleteDialog";
import DataTable from "@/components/datatable";
import { getFormasPagamentosColumns } from "./formasPagamentosColumns";
import FormaPagamentoForm from "./form";

interface FormaPagamentoProps {
  setFormaPagamento?: (formaPagamento: IFormaPagamento) => void;
}

export function FormasPagamentosPage({ setFormaPagamento }: FormaPagamentoProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<IFormaPagamento | null>(null);
  const deleteFormaPagamento = DeleteFormaPagamento();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetFormasPagamentos"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((formaPagamento: IFormaPagamento) => {
    setSelectedFormaPagamento(formaPagamento);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((formaPagamento: IFormaPagamento) => {
    setAction("Edit");
    setSelectedFormaPagamento(formaPagamento);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedFormaPagamento(null);
    setOpen(true);
  }, []);

  const onView = useCallback((formaPagamento: IFormaPagamento) => {
    setAction("View");
    setSelectedFormaPagamento(formaPagamento);
    setOpen(true);
  }, []);

  const formasPagamentosQuery = GetFormasPagamentos(ativos);
  const formasPagamentos = formasPagamentosQuery.data || []; // Ensure paises is an array

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Formas de Pagamentos</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <FormaPagamentoForm
              action={action}
              isOpen={open}
              formaPagamento={selectedFormaPagamento}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedFormaPagamento(null);
              }}
              setFormaPagamento={setFormaPagamento}
            />
            <DeleteDialog
              registerId={selectedFormaPagamento?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteFormaPagamento}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedFormaPagamento(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(
            () => getFormasPagamentosColumns({ onEdit, onDelete: setFormaPagamento ? undefined : onDelete, onView }),
            [],
          )}
          data={formasPagamentos}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setFormaPagamento}
        />
      </CardContent>
    </Card>
  );
}
