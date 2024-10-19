import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteFornecedorRequest, GetFornecedoresRequest, PostFornecedorRequest, PutFornecedorRequest } from "./api";
import { IFornecedor, IPostFornecedor, IPutFornecedor } from "@/interfaces/fornecedor.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function GetFornecedores(Ativos: boolean) {
  return useQuery({
    queryKey: ["GetFornecedores", Ativos],
    queryFn: ({ queryKey }) => GetFornecedoresRequest(Boolean(queryKey[1])),
  });
}

export function PutFornecedor(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPutFornecedor) => PutFornecedorRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function PostFornecedor(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPostFornecedor) => PostFornecedorRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      onOpenChange(false);
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}

export function DeleteFornecedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idFornecedor: number) => DeleteFornecedorRequest(idFornecedor),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["GetFornecedores"] });
      toast.success(`${response}`);
    },
    onError: (error: AxiosError) => {
      toast.error(`${error.response?.data}`);
    },
  });
}
