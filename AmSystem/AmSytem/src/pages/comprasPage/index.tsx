import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DataTable from "@/components/datatable";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import DeleteDialog from "@/components/dialog/deleteDialog3";
import { ICompra, initialCompra } from "@/interfaces/compra.interfaces";
import { GetCompras, DeleteCompra, CancelCompra } from "./services/queries";
import CompraForm from "./form/form";
import { getComprasColumns } from "./columns";
import CancelDialog from "@/components/dialog/cancelDialog";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";

export function ComprasPage({}) {
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [canceladas, setCanceladas] = useState<boolean>(false);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [selectedCompra, setSelectedCompra] = useState<ICompra | undefined>();

  const queryClient = useQueryClient();
  const cancelCompra = CancelCompra(setOpenCancelDialog);

  const onGet = useCallback(async () => {
    try {
      setCanceladas(!canceladas);
      await queryClient.invalidateQueries("GetCompras");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [canceladas, queryClient]);

  const onCancel = useCallback((compra: ICompra) => {
    setSelectedCompra(compra);
    setOpenCancelDialog(true);
  }, []);

  const onView = useCallback((compra: ICompra) => {
    setAction("View");
    setSelectedCompra(compra);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedCompra({ ...initialCompra });
    setOpen(true);
  }, []);

  const handleCancelCompra = (confirmed: boolean) => {
    if (confirmed) {
      cancelCompra.mutate(selectedCompra as IPutCompraPai);
    }
  };

  const comprasQuery = GetCompras(canceladas);
  const comprasData = comprasQuery.data || [];

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Compras</CardTitle>
        <div className="flex justify-between bg-red-400">
          <div className="bg-red-500 border-red-100">
            <CompraForm
              action={action}
              isOpen={open}
              compra={selectedCompra}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedCompra(undefined);
              }}
            />
            <CancelDialog
              isOpen={openCancelDialog}
              onConfirm={handleCancelCompra}
              onOpenChange={setOpenCancelDialog}
              label="Você têm certeza que deseja cancelar nota?"
              buttonLabel="Cancelar"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getComprasColumns({ onView, onCancel }), [])}
          data={comprasData}
          onAdd={onAdd}
          onGet={onGet}
          ativos={canceladas}
          labelAtivos="Canceladas"
        />
      </CardContent>
    </Card>
  );
}

export default ComprasPage;
