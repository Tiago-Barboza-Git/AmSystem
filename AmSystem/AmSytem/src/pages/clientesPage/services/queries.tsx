import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteClienteRequest,
  GetClientesRequest,
  PostClienteRequest,
  PutClienteRequest,
} from "./api";
import {
  iCliente,
  iClientePost,
  iClientePut,
} from "@/interfaces/cliente.interfaces";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      onOpenChange(false);
      toast.success("Cliente atualizado com sucesso!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(`Erro ao atualizar cliente. Erro: ${error}!`);
    },
  });
}

export function PostCliente(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: iClientePost) => PostClienteRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      onOpenChange(false);
      toast.success("Cliente adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      console.log(error.response?.data);
      toast.error(`Erro ao adicionar cliente. Erro: ${error.response?.data}!`);
    },
  });
}

export function DeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idEstado: Number) => DeleteClienteRequest(idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClientes"] });
      toast.success("Cliente deleteado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao deletar cliente. Erro: ${error}!`);
    },
  });
}
