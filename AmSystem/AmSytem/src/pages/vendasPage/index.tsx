import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DataTable from "@/components/datatable";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import DeleteDialog from "@/components/dialog/deleteDialog3";
import { GetVendas, CancelVenda } from "./services/queries";
import { getVendasColumns } from "./columns";
import CancelDialog from "@/components/dialog/cancelDialog";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";
import VendaForm from "./form";
import { IVenda, IVendaDetails, initialVenda } from "@/interfaces/Venda/venda.interface";

export function VendasPage({}) {
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [canceladas, setCanceladas] = useState<boolean>(false);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [selectedVenda, setSelectedVenda] = useState<IVenda | undefined>();

  const queryClient = useQueryClient();
  const cancelCompra = CancelVenda(setOpenCancelDialog);

  const onGet = useCallback(async () => {
    try {
      setCanceladas(!canceladas);
      await queryClient.invalidateQueries("GetCompras");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [canceladas, queryClient]);

  const onCancel = useCallback((venda: IVenda) => {
    setSelectedVenda(venda);
    setOpenCancelDialog(true);
  }, []);

  const onView = useCallback((venda: IVenda) => {
    setAction("View");
    setSelectedVenda(venda);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedVenda({ ...initialVenda });
    setOpen(true);
  }, []);

  const handleCancelCompra = (confirmed: boolean) => {
    if (confirmed) {
      cancelCompra.mutate(selectedVenda as IVendaDetails);
    }
  };

  const vendasQuery = GetVendas(canceladas);
  const vendasData = vendasQuery.data || [];

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Vendas</CardTitle>
        <div className="flex justify-between bg-red-400">
          <div className="bg-red-500 border-red-100">
            <VendaForm
              action={action}
              isOpen={open}
              venda={selectedVenda}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedVenda(undefined);
              }}
            />
            {/* <CancelDialog
              isOpen={openCancelDialog}
              onConfirm={handleCancelCompra}
              onOpenChange={setOpenCancelDialog}
              label="Você têm certeza que deseja cancelar nota?"
            /> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getVendasColumns({ onView, onCancel }), [])}
          data={vendasData}
          onAdd={onAdd}
          onGet={onGet}
          ativos={canceladas}
          labelAtivos="Canceladas"
        />
      </CardContent>
    </Card>
  );
}

export default VendasPage;
