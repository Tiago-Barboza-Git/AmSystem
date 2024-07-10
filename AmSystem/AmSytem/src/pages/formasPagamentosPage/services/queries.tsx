import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteFormaPagamentoRequest,
  GetFormasPagamentosRequest,
  PostFormaPagamentoRequest,
  PutFormaPagamentoRequest,
} from "./api";
import {
  IPostFormaPagamento,
  IPutFormaPagamento,
} from "@/interfaces/formaPagamento.interfaces";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      onOpenChange(false);
      toast.success("Forma de pagamento atualizada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao atualizar a forma de pagamento. Erro: ${error.response?.data}`
      );
    },
  });
}

export function PostFormaPagamento(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFormaPagamento) => PostFormaPagamentoRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      onOpenChange(false);
      toast.success("Forma de pagamento adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao adicionar a forma de pagamento. Erro: ${error.response?.data}`
      );
    },
  });
}

export function DeleteFormaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFormaPagamento: Number) =>
      DeleteFormaPagamentoRequest(idFormaPagamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFormasPagamentos"] });
      toast.success("Forma de pagamento deletada com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao deletar a forma de pagamento. Erro: ${error.response?.data}`
      );
    },
  });
}
