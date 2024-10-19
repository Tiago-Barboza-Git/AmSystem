import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteUnidadeMedidaRequest,
  GetUnidadesMedidasRequest,
  PostUnidadeMedidaRequest,
  PutUnidadeMedidaRequest,
} from "./api";
import { IPostUnidadeMedida, IPutUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetUnidadesMedidas(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetUnidadesMedidas", Ativos],
    queryFn: ({ queryKey }) => GetUnidadesMedidasRequest(Boolean(queryKey[1])),
  });
}

export function PutUnidadeMedida(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutUnidadeMedida) => PutUnidadeMedidaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetUnidadesMedidas"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostUnidadeMedida(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostUnidadeMedida) => PostUnidadeMedidaRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetUnidadesMedidas"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteUnidadeMedida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idUnidadeMedida: number) => DeleteUnidadeMedidaRequest(idUnidadeMedida),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetUnidadesMedidas"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
