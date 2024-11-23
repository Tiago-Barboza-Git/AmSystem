import { useMutation, useQuery, useQueryClient } from "react-query";
import { GetContasReceberRequest, PutContaReceberRequest } from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import { IPostCondicaoPagamento, IPutCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IPutContaPagar } from "@/interfaces/contasPagar";
import { IPutContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";

export function GetContasReceber(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetContasReceber", Ativos],
    queryFn: ({ queryKey }) => GetContasReceberRequest(Boolean(queryKey[1])),
  });
}

export function PutContasReceber(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutContaReceber) => PutContaReceberRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetContasReceber"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
