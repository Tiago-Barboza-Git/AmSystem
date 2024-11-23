import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteCondicaoPagamentoRequest,
  GetCondicoesPagamentosRequest,
  PostCondicaoPagamentoRequest,
  PutCondicaoPagamentoRequest,
} from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import { IPostCondicaoPagamento, IPutCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetCondicoesPagamentos(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetCondicoesPagamentos", Ativos],
    queryFn: ({ queryKey }) => GetCondicoesPagamentosRequest(Boolean(queryKey[1])),
  });
}

export function PutCondicaoPagamento(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCondicaoPagamento) => PutCondicaoPagamentoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCondicoesPagamentos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostCondicaoPagamento(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCondicaoPagamento) => PostCondicaoPagamentoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCondicoesPagamentos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteCondicaoPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCondicaoPagamento: number) => DeleteCondicaoPagamentoRequest(idCondicaoPagamento),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCondicoesPagamentos"] });
      toast.success(`${response}`);
    },
    onError: (error: errorAPI) => {
      toast.error(`${error.response.data}`);
    },
  });
}
