import DataTable from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useMemo, useState } from "react";
import { getContaPagarColumns } from "./columns";
import { IContaPagar } from "@/interfaces/contasPagar";
import ContaPagarForm from "./form";
import { GetContasPagar } from "./services/queries";
import { useQueryClient } from "react-query";

function ContasPagarPage() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
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

  const contasPagarQuery = GetContasPagar(canceladas);
  const contasPagar = contasPagarQuery.data || []; // Ensure paises is an array

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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getContaPagarColumns({ onPagar, onView }), [])}
          data={contasPagar}
          onGet={onGet}
          ativos={canceladas}
          labelAtivos="Canceladas"
        />
      </CardContent>
    </Card>
  );
}

export default ContasPagarPage;
