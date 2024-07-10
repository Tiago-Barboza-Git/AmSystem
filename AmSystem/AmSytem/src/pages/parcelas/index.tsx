import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IParcela } from "@/interfaces/parcela.interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProdutoForm from "../produtosPage/produtoForm";
import DeleteDialog from "@/components/dialog/deleteDialog";
import DataTable from "./dataTable/index";
import { getParcelasColumns } from "./parcelasColumns";
import { ParcelaForm } from "./form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParcelasProps {
  parcelas: IParcela[];
}

export const Parcelas = ({ parcelas }: ParcelasProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [selectedParcela, setSelectedParcela] = useState<IParcela | null>(null);
  let parcelasTeste = [];
  useEffect(() => {
    parcelas.push(selectedParcela as IParcela);
  }, [setSelectedParcela]);

  const onDelete = useCallback((parcela: IParcela) => {
    setSelectedParcela(parcela);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((parcela: IParcela) => {
    setAction("Edit");
    setSelectedParcela(parcela);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedParcela(null);
    setOpen(true);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Parcelas</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <ParcelaForm
              isOpen={open}
              setParcela={setSelectedParcela}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedParcela(null);
              }}
            />
            {/* <DeleteDialog
              registerId={selectedParcela?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteProduto}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedParcela(null);
              }}
            /> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <DataTable
          columns={useMemo(() => getParcelasColumns({ onEdit, onDelete }), [])}
          data={parcelas}
          onAdd={onAdd}
        /> */}
      </CardContent>
    </Card>
  );
};
