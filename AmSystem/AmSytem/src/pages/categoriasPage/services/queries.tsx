import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteCategoriaRequest,
  GetCategoriasRequest,
  PostCategoriaRequest,
  PutCategoriaRequest,
} from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import {
  IPostCategoria,
  IPutCategoria,
} from "@/interfaces/categoria.interfaces";
import { toast } from "sonner";
import { Axios, AxiosError } from "axios";

export function GetCategorias(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetCategorias", Ativos],
    queryFn: ({ queryKey }) => GetCategoriasRequest(Boolean(queryKey[1])),
  });
}

export function PutCategoria(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCategoria) => PutCategoriaRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      onOpenChange(false);
      toast.success("Categorias atualizada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar categoria. Erro: ${error.response?.data}`);
    },
  });
}

export function PostCategoria(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCategoria) => PostCategoriaRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      onOpenChange(false);
      toast.success("Categoria adicionada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao adicionar categorias. Erro: ${error.response?.data}`
      );
    },
  });
}

export function DeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCategoria: Number) => DeleteCategoriaRequest(idCategoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      toast.success(`Categoria deletada com sucesso!`);
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar categoria. Erro: ${error.response?.data}`);
    },
  });
}
