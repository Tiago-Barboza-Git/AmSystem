import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteClienteRequest, GetClientesRequest, PostClienteRequest, PutClienteRequest } from "./api";
import { iCliente, iClientePost, iClientePut } from "@/interfaces/cliente.interfaces";
import { toast } from "sonner";

import { AxiosError } from "axios";

export function GetClientes(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetClientes", Ativos],
    queryFn: ({ queryKey }) => GetClientesRequest(Boolean(queryKey[1])),
  });
}

export function PutCliente(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: iClientePut) => PutClienteRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function PostCliente(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: iClientePost) => PostClienteRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idCliente: number) => DeleteClienteRequest(idCliente),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
