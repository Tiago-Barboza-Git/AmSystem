import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteProdutoRequest,
  GetProdutosRequest,
  PostProdutoRequest,
  PutProdutoRequest,
} from "./api";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      onOpenChange(false);
      toast.success("Produto atualizado com sucesso.");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao atualizar o produto. Erro: ${error.response?.data}`);
    },
  });
}

export function PostProduto(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostProduto) => PostProdutoRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      onOpenChange(false);
      toast.success("Produto adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao adicionar produto. Erro: ${error.response?.data}`);
    },
  });
}

export function DeleteProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idProduto: Number) => DeleteProdutoRequest(idProduto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetProdutos"] });
      toast.success("Produto deletado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar produto. Erro: ${error.response?.data}`);
    },
  });
}
