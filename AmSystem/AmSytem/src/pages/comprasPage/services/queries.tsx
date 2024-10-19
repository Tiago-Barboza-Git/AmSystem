import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CancelCompraRequest,
  DeleteCompraRequest,
  GetComprasRequest,
  GetVerificaExistenciaCompraRequest,
  PostCompraRequest,
  PutCompraRequest,
} from "./api";
import { IPostCompra, IPutCompra } from "@/interfaces/compra.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { number } from "zod";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";

export function GetCompras(pCanceladas: boolean) {
  return useQuery({
    queryKey: ["GetCompras", pCanceladas],
    queryFn: ({ queryKey }) => GetComprasRequest(Boolean(queryKey[1])),
  });
}

export function PutCompra(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCompra) => PutCompraRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostCompra(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCompra) => PostCompraRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteCompra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCompra: number) => DeleteCompraRequest(idCompra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
    },
  });
}

export function CancelCompra(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPutCompraPai) => CancelCompraRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function GetVerificaExistenciaCompra(
  nrNota?: number,
  nrModelo?: number,
  nrSerie?: number,
  idFornecedor?: number,
) {
  return useMutation(
    ({
      nrNota,
      nrModelo,
      nrSerie,
      idFornecedor,
    }: {
      nrNota: number;
      nrModelo: number;
      nrSerie: number;
      idFornecedor: number;
    }) => GetVerificaExistenciaCompraRequest(nrNota, nrModelo, nrSerie, idFornecedor),
  );
}
