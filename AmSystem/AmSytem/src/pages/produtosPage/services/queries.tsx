import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteProdutoRequest, GetProdutosRequest, PostProdutoRequest, PutProdutoRequest } from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostProduto, IPutProduto } from "@/interfaces/produto.interfaces";
import { toast } from "sonner";
import { Axios, AxiosError } from "axios";

export function GetProdutos(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetProdutos", Ativos],
    queryFn: ({ queryKey }) => GetProdutosRequest(Boolean(queryKey[1])),
  });
}

export function PutProduto(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutProduto) => PutProdutoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostProduto(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostProduto) => PostProdutoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idProduto: number) => DeleteProdutoRequest(idProduto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
