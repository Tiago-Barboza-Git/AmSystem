import DataTable from "@/components/datatable";
import { DeleteCategoria, GetCategorias } from "./services/queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient, UseQueryResult } from "react-query";
// import PaisForm from "./paisForm/index.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { getCategoriasColumns } from "./categoriasColumns";
import CategoriaForm from "./categoriaForm";

interface CategoriasPageProps {
  setCategoria?: (categoria: ICategoria) => void;
}

export function CategoriasPage({ setCategoria }: CategoriasPageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [ativos, setAtivos] = useState<boolean>(true);
  const [selectedCategoria, setSelectedCategoria] = useState<ICategoria | null>(null);
  const deleteCategoria = DeleteCategoria();

  const onGet = useCallback(async () => {
    try {
      setAtivos(!ativos);
      await queryClient.invalidateQueries("GetCategorias"); // Invalidate the cache for "paises" query
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [ativos, queryClient]);

  const onDelete = useCallback((categoria: ICategoria) => {
    setSelectedCategoria(categoria);
    setOpenDeleteDialog(true);
  }, []);

  const onEdit = useCallback((categoria: ICategoria) => {
    setAction("Edit");
    setSelectedCategoria(categoria);
    setOpen(true);
  }, []);

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedCategoria(null);
    setOpen(true);
  }, []);

  const onView = useCallback((categoria: ICategoria) => {
    setAction("View");
    setSelectedCategoria(categoria);
    setOpen(true);
  }, []);

  const categoriasQuery = GetCategorias(ativos);

  return (
    <Card className={`h-full`}>
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
        <div className="flex justify-between bg-red-400">
          <div className="bg-red-500 border-red-100">
            <CategoriaForm
              action={action}
              isOpen={open}
              categoria={selectedCategoria}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) setSelectedCategoria(null);
              }}
            />
            <DeleteDialog
              registerId={selectedCategoria?.id as number}
              isOpen={openDeleteDialog}
              deleteFunction={deleteCategoria}
              onOpenChange={(value) => {
                setOpenDeleteDialog(value);
                if (!value) setSelectedCategoria(null);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={useMemo(() => getCategoriasColumns({ onEdit, onDelete, onView }), [])}
          data={categoriasQuery.data || []}
          onAdd={onAdd}
          onGet={onGet}
          ativos={ativos}
          setObj={setCategoria}
        />
      </CardContent>
    </Card>
  );
}
