import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeletePaisRequest, GetPaisesRequest, PostPaisRequest, PutPaisRequest } from "./api";
import { IPostPais, IPutPais } from "@/interfaces/pais.interfaces";
import { toast } from "sonner";
import { Axios, AxiosError, AxiosResponse } from "axios";

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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostPais(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostPais) => PostPaisRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeletePais() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idPais: number) => DeletePaisRequest(idPais),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetPaises"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
