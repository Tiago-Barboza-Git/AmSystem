import { useMutation, useQuery, useQueryClient } from "react-query";
import { CancelVendaRequest, GetVendasRequest, PostVendaRequest } from "./api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { number } from "zod";
import { CancelCompraRequest } from "@/pages/comprasPage/services/api";
import { IPostVenda, IVendaDetails } from "@/interfaces/Venda/venda.interface";

export function GetVendas(pCanceladas: boolean) {
  return useQuery({
    queryKey: ["GetVendas", pCanceladas],
    queryFn: ({ queryKey }) => GetVendasRequest(Boolean(queryKey[1])),
  });
}

export function CancelVenda(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IVendaDetails) => CancelVendaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetVendas"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: errorAPI) => {
      toast.error(`${error.response.data.message}`);
    },
  });
}

export function PostVenda(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostVenda) => PostVendaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetVendas"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (response) => {
      toast.error(`${response}`);
    },
  });
}
