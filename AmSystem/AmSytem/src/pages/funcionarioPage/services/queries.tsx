import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteFuncionarioRequest, GetFuncionariosRequest, PostFuncionarioRequest, PutFuncionarioRequest } from "./api";
import { IPostFuncionario, IPutFuncionario } from "@/interfaces/funcionario.interfaces";
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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostFuncionario(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFuncionario) => PostFuncionarioRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteFuncionario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFuncionario: number) => DeleteFuncionarioRequest(idFuncionario),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFuncionarios"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
