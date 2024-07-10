import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeleteFuncionarioRequest,
  GetFuncionariosRequest,
  PostFuncionarioRequest,
  PutFuncionarioRequest,
} from "./api";
import {
  IPostFuncionario,
  IPutFuncionario,
} from "@/interfaces/funcionario.interfaces";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function GetFuncionarios(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetFuncionarios", Ativos],
    queryFn: ({ queryKey }) => GetFuncionariosRequest(Boolean(queryKey[1])),
  });
}

export function PutFuncionario(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutFuncionario) => PutFuncionarioRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      onOpenChange(false);
      toast.success("Funcionário atualizado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao atualizar o funcionário. Erro: ${error.response?.data}`
      );
    },
  });
}

export function PostFuncionario(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFuncionario) => PostFuncionarioRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      onOpenChange(false);
      toast.success("Funcionário adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Erro ao adicionar funcionário. Erro: ${error.response?.data}`
      );
    },
  });
}

export function DeleteFuncionario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFuncionario: Number) =>
      DeleteFuncionarioRequest(idFuncionario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      toast.success("Funcionário deletado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar funcionário. Erro: ${error.response?.data}`);
    },
  });
}
