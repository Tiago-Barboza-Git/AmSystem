import { useMutation, useQuery, useQueryClient } from "react-query";
import { CancelVendaRequest, GetVendasRequest, PostVendaRequest, VerificaVendaRequest } from "./api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { number } from "zod";
import { CancelCompraRequest } from "@/pages/comprasPage/services/api";
import { IPostVenda, IPutVenda, IVenda } from "@/interfaces/Venda/venda.interface";
import { useState } from "react";

export function GetVendas(pCanceladas: boolean) {
  return useQuery({
    queryKey: ["GetVendas", pCanceladas],
    queryFn: ({ queryKey }) => GetVendasRequest(Boolean(queryKey[1])),
  });
}

export function CancelVenda(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPutVenda) => CancelVendaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetVendas"] });
      onOpenChange(false);
      toast.success(`Venda cancelada com sucesso!`);
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

export function VerificaVenda() {
  return useMutation(
    ({
      nrNota,
      nrModelo,
      nrSerie,
      idCliente,
    }: {
      nrNota: number;
      nrModelo: number;
      nrSerie: number;
      idCliente: number;
    }) => VerificaVendaRequest(nrNota, nrModelo, nrSerie, idCliente),
  );
}

// export function GetVendas(pCanceladas: boolean) {
//   return useQuery({
//     queryKey: ["GetVendas", pCanceladas],
//     queryFn: ({ queryKey }) => GetVendasRequest(Boolean(queryKey[1])),
//   });
// }
