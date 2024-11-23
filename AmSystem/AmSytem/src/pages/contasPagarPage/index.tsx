import DataTable from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useMemo, useState } from "react";
import { getContaPagarColumns } from "./columns";
import { IContaPagar, initialContaPagar } from "@/interfaces/contasPagar";
import ContaPagarForm from "./form";
import { GetContasPagar, PutCancelarContaPagarAvulsa } from "./services/queries";
import { useQueryClient } from "react-query";
import ContaPagarFormAdd from "./formAdd";
import CancelDialog from "@/components/dialog/cancelDialog";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";

function ContasPagarPage() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [canceladas, setCanceladas] = useState<boolean>(false);
  const [openPagamento, setOpenPagamento] = useState<boolean>(false);
  const [selectedContaPagar, setSelectedContaPagar] = useState<IContaPagar | null>(null);

  const onGet = useCallback(async () => {
    try {
      setCanceladas(!canceladas);
      await queryClient.invalidateQueries("GetContasPagar"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [canceladas, queryClient]);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedContaPagar({ ...initialContaPagar });
    setOpenAddForm(true);
  }, []);

  const onPagar = useCallback((contaPagar: IContaPagar) => {
    setAction("Edit");
    setSelectedContaPagar(contaPagar);
    setOpen(true);
  }, []);

  const onView = useCallback((contaPagar: IContaPagar) => {
    setAction("View");
    setSelectedContaPagar(contaPagar);
    setOpen(true);
  }, []);

  const cancelContaPagar = PutCancelarContaPagarAvulsa(setOpenCancelDialog);

  const onCancel = useCallback((contaPagar: IContaPagar) => {
    setSelectedContaPagar(contaPagar);
    setOpenCancelDialog(true);
  }, []);

  const handleCancelContaPagar = (confirmed: boolean) => {
    if (confirmed) {
      cancelContaPagar.mutate(selectedContaPagar as IPutCompraPai);
    }
  };

  const contasPagarQuery = GetContasPagar(canceladas);
  const contasPagar = contasPagarQuery.data || []; // Ensure paises is an array
  console.log(contasPagar);

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Contas a Pagar</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <ContaPagarForm
              action={action}
              isOpen={open}
              contaPagar={selectedContaPagar}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedContaPagar(null);
              }}
            />
            <ContaPagarFormAdd
              action={action}
              isOpen={openAddForm}
              contaPagar={selectedContaPagar}
              onOpenChange={(value) => {
                setOpenAddForm(value);
                if (!value) setSelectedContaPagar(null);
              }}
            />
            <CancelDialog
              isOpen={openCancelDialog}
              onConfirm={handleCancelContaPagar}
              onOpenChange={setOpenCancelDialog}
              label="Você têm certeza que deseja cancelar a conta a pagar avulsa?"
              buttonLabel="Cancelar"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getContaPagarColumns({ onPagar, onView, onCancel }), [])}
          data={contasPagar}
          onGet={onGet}
          onAdd={onAdd}
          ativos={canceladas}
          labelAtivos="Canceladas"
        />
      </CardContent>
    </Card>
  );
}

export default ContasPagarPage;
