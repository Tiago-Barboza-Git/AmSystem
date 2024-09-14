import DataTable from "@/components/datatable";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { getProdutosColumns } from "./produtosColumns";
import { IProduto } from "@/interfaces/produto.interfaces";
import { DeleteProduto, GetProdutos } from "./services/queries";
import ProdutoForm from "./produtoForm";

interface produtosPageProps {
  setProduto?: (produto: IProduto) => void;
}

export function ProdutosPage({ setProduto }: produtosPageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedProduto, setSelectedProduto] = useState<IProduto | null>(null);
  const deleteProduto = DeleteProduto();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetProdutos"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((produto: IProduto) => {
    setSelectedProduto(produto);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((produto: IProduto) => {
    setAction("Edit");
    setSelectedProduto(produto);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedProduto(null);
    setOpen(true);
  }, []);

  const produtosQuery = GetProdutos(ativos);
  const produtos = produtosQuery.data || []; // Ensure paises is an array

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <ProdutoForm
              action={action}
              isOpen={open}
              produto={selectedProduto}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedProduto(null);
              }}
            />
            <DeleteDialog
              registerId={selectedProduto?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteProduto}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedProduto(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getProdutosColumns({ onEdit, onDelete }), [])}
          data={produtos}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setProduto}
        />
      </CardContent>
    </Card>
  );
}
