import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteEstadoRequest, GetEstadosRequest, PostEstadoRequest, PutEstadoRequest } from "./api";
import { IPostEstado, IPutEstado } from "@/interfaces/estado.interfaces";
import { toast } from "sonner";
import { Axios, AxiosError } from "axios";

export function GetEstados(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetEstados", Ativos],
    queryFn: ({ queryKey }) => GetEstadosRequest(Boolean(queryKey[1])),
  });
}

export function PutEstado(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutEstado) => PutEstadoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetEstados"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostEstado(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostEstado) => PostEstadoRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetEstados"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteEstado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idEstado: number) => DeleteEstadoRequest(idEstado),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetEstados"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
