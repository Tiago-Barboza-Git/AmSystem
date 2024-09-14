import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DataTable from "@/components/datatable";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { ICompra, initialCompra } from "@/interfaces/compra.interfaces";
import { GetCompras, DeleteCompra } from "./services/queries";
import CompraForm from "./form/form";
import { getComprasColumns } from "./columns";

export function ComprasPage({}) {
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCompra, setSelectedCompra] = useState<ICompra | undefined>();

  const queryClient = useQueryClient();
  const deleteCompra = DeleteCompra();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetNotasEntrada");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const onCancel = useCallback((compra: ICompra) => {
    setSelectedCompra(compra);
    setOpenDeleteDialog(true);
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

  const comprasQuery = GetCompras();
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
            {/* <DeleteDialog
              registerId={setSelectedNotaEntrada?. as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteCompra}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedNotaEntrada(null);
              }}
            /> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getComprasColumns({ onView, onCancel }), [])}
          data={comprasData}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          //   setObj={setUnidadeMedida}
        />
      </CardContent>
    </Card>
  );
}

export default ComprasPage;
