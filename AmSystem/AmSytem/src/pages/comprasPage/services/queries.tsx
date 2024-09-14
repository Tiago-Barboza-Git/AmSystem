import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteCompraRequest,
  GetCompraRequest,
  GetComprasRequest,
  GetVerificaExistenciaCompraRequest,
  PostCompraRequest,
  PutCompraRequest,
} from "./api";
import { IPostCompra, IPutCompra } from "@/interfaces/compra.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetCompra(nrNota?: number, nrModelo?: number, nrSerie?: number, idFornecedor?: number) {
  return useQuery({
    queryKey: ["GetCompra"],
    queryFn: () => GetCompraRequest(nrNota, nrModelo, nrSerie, idFornecedor),
  });
}

export function GetCompras() {
  return useQuery({
    queryKey: ["GetCompras"],
    queryFn: () => GetComprasRequest(),
  });
}

export function PutCompra(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutCompra) => PutCompraRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
      onOpenChange(false);
      toast.success("Compra atualizada com sucesso.");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao atualizar a compra. Erro: ${error.response?.data}`);
    },
  });
}

export function PostCompra(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostCompra) => PostCompraRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCompras"] });
      onOpenChange(false);
      toast.success("Compra adicionada com sucesso");
    },
    onError: (response) => {
      toast.error(`Erro ao adicionar a compra. ${response}`);
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
  // return useQuery({
  //   queryKey: ["GetVerificaExistenciaCompra"],
  //   queryFn: () =>
  //     GetVerificaExistenciaCompraRequest(Number(nrNota), Number(nrModelo), Number(nrSerie), Number(idFornecedor)).then(
  //       (response) => response,
  //     ),
  // });
}
