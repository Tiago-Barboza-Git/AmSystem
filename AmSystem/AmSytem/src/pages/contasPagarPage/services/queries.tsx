import { useMutation, useQuery, useQueryClient } from "react-query";
import { GetContasPagarRequest, PutContaPagarRequest } from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import { IPostCondicaoPagamento, IPutCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IPutContaPagar } from "@/interfaces/contasPagar";

export function GetContasPagar(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetContasPagar", Ativos],
    queryFn: ({ queryKey }) => GetContasPagarRequest(Boolean(queryKey[1])),
  });
}

export function PutContasPagar(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutContaPagar) => PutContaPagarRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetContasPagar"] });
      onOpenChange(false);
      toast.success("Conta a pagar paga com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao pagar a conta a pagar. Erro: ${error.response?.data}`);
    },
  });
}
