import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteCidadeRequest,
  GetCidadesRequest,
  PostCidadeRequest,
  PutCidadeRequest,
} from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function GetCidades(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetCidades", Ativos],
    queryFn: ({ queryKey }) => GetCidadesRequest(Boolean(queryKey[1])),
  });
}

export function PutCidade(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCidade) => PutCidadeRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCidades"] });
      onOpenChange(false);
      toast.success("Cidade atualizada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao atualizar cidade. Erro: ${error.response?.data}`);
    },
  });
}

export function PostCidade(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCidade) => PostCidadeRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCidades"] });
      onOpenChange(false);
      toast.success("Cidade adicionada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao adicionar cidade. Erro: ${error.response?.data}`);
    },
  });
}

export function DeleteCidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCidade: Number) => DeleteCidadeRequest(idCidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCidades"] });
      toast.success("Cidade deletada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar cidade. Erro: ${error.response?.data}`);
    },
  });
}
