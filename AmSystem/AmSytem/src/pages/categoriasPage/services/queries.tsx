import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteCategoriaRequest, GetCategoriasRequest, PostCategoriaRequest, PutCategoriaRequest } from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCategoria, IPutCategoria } from "@/interfaces/categoria.interfaces";
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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostCategoria(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCategoria) => PostCategoriaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCategoria: number) => DeleteCategoriaRequest(idCategoria),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCategorias"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
