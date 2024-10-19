import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteFormaPagamentoRequest,
  GetFormasPagamentosRequest,
  PostFormaPagamentoRequest,
  PutFormaPagamentoRequest,
} from "./api";
import { IPostFormaPagamento, IPutFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetFormasPagamentos(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetFormasPagamentos", Ativos],
    queryFn: ({ queryKey }) => GetFormasPagamentosRequest(Boolean(queryKey[1])),
  });
}

export function PutFormaPagamento(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutFormaPagamento) => PutFormaPagamentoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostFormaPagamento(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFormaPagamento) => PostFormaPagamentoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteFormaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFormaPagamento: number) => DeleteFormaPagamentoRequest(idFormaPagamento),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
