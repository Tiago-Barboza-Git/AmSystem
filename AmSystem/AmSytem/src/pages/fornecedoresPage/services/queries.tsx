import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteFornecedorRequest,
  GetFornecedoresRequest,
  PostFornecedorRequest,
  PutFornecedorRequest,
} from "./api";
import {
  IFornecedor,
  IPostFornecedor,
  IPutFornecedor,
} from "@/interfaces/fornecedor.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetFornecedores(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetFornecedores", Ativos],
    queryFn: ({ queryKey }) => GetFornecedoresRequest(Boolean(queryKey[1])),
  });
}

export function PutFornecedor(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutFornecedor) => PutFornecedorRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      onOpenChange(false);
      toast.success("Fornecedor atualizado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao atualizar fornecedor. Erro: ${error.response?.data}`
      );
    },
  });
}

export function PostFornecedor(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFornecedor) => PostFornecedorRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      onOpenChange(false);
      toast.success("Fornecedor adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao adicionar fornecedor. Erro: ${error.response?.data}`
      );
    },
  });
}

export function DeleteFornecedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFornecedor: Number) => DeleteFornecedorRequest(idFornecedor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      toast.success("Fornecedor deletado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar fornecedor. Erro: ${error.response?.data}`);
    },
  });
}
