import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DeletePaisRequest,
  GetPaisesRequest,
  PostPaisRequest,
  PutPaisRequest,
} from "./api";
import { IPostPais, IPutPais } from "@/interfaces/pais.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetPaises(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetPaises", Ativos],
    queryFn: ({ queryKey }) => GetPaisesRequest(Boolean(queryKey[1])),
  });
}

export function PutPais(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutPais) => PutPaisRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      onOpenChange(false);
      toast.success("País atualizado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao atualizar o país. Erro: ${error.response?.data}`);
    },
  });
}

export function PostPais(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostPais) => PostPaisRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      onOpenChange(false);
      toast.success("País adicionado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao adicionar o país. Erro: ${error.response?.data}`);
    },
  });
}

export function DeletePais() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idPais: Number) => DeletePaisRequest(idPais),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      toast.success("País deletado com sucesso!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Erro ao deletar o país. Erro: ${error.response?.data}`);
    },
  });
}
