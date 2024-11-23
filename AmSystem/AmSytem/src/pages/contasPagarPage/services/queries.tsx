import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  GetContasPagarRequest,
  PutContaPagarRequest,
  PostContaPagarAvulsaRequest,
  PutCancelarContaPagarAvulsaRequest,
} from "./api";
import { isQueryKey } from "react-query/types/core/utils";
import { IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import { IPostCondicaoPagamento, IPutCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IPostContaPagarAvulsa, IPutContaPagar } from "@/interfaces/contasPagar";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";

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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetContasPagar"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostContaPagarAvulsa(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostContaPagarAvulsa) => PostContaPagarAvulsaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetContasPagar"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PutCancelarContaPagarAvulsa(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCompraPai) => PutCancelarContaPagarAvulsaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetContasPagar"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
