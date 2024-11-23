import DataTable from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getContaReceberColumns } from "./columns";
import { IContaPagar } from "@/interfaces/contasPagar";
import ContaPagarForm from "./form";
import { GetContasReceber } from "./services/queries";
import { useQueryClient } from "react-query";
import { IContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";
import ContaReceberForm from "./form";

function ContasReceberPage() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [canceladas, setCanceladas] = useState<boolean>(false);
  const [openPagamento, setOpenPagamento] = useState<boolean>(false);
  const [selectedContaReceber, setSelectedContaReceber] = useState<IContaReceber | null>(null);
  const [contasReceber, setContasReceber] = useState<IContaReceber[]>();

  const onGet = useCallback(async () => {
    try {
      setCanceladas(!canceladas);
      await queryClient.invalidateQueries("GetContasPagar"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [canceladas, queryClient]);

  const onReceber = useCallback((contaReceber: IContaReceber) => {
    setAction("Edit");
    setSelectedContaReceber(contaReceber);
    setOpen(true);
  }, []);

  const onView = useCallback((contaReceber: IContaReceber) => {
    setAction("View");
    setSelectedContaReceber(contaReceber);
    setOpen(true);
  }, []);

  // const contasPagarQuery = GetContasReceber(canceladas);
  // const contasReceber = contasPagarQuery.data || []; // Ensure paises is an array

  const contasReceberQuery = GetContasReceber(canceladas);

  useEffect(() => {
    console.log("teste");
    if (contasReceberQuery.data) {
      console.log(contasReceberQuery.data);
      setContasReceber(contasReceberQuery.data || []);
    }
  }, [contasReceberQuery.data]);

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Contas à Receber</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <ContaReceberForm
              action={action}
              isOpen={open}
              contaReceber={selectedContaReceber}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedContaReceber(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getContaReceberColumns({ onReceber, onView }), [])}
          data={contasReceber}
          onGet={onGet}
          ativos={canceladas}
          labelAtivos="Canceladas"
        />
      </CardContent>
    </Card>
  );
}

export default ContasReceberPage;
