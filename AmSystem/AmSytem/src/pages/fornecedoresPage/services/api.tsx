import {
  IFornecedor,
  IPostFornecedor,
  IPutFornecedor,
} from "@/interfaces/fornecedor.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetFornecedoresRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<IFornecedor[]>(`GetFornecedores?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutFornecedorRequest = (Estado: IPutFornecedor) => {
  return axiosInstance
    .put<IPutFornecedor>("PutFornecedor", Estado)
    .then((response) => response.data);
};

export const PostFornecedorRequest = (Estado: IPostFornecedor) => {
  return axiosInstance
    .post<IPostFornecedor>("PostFornecedor", Estado)
    .then((response) => response.data);
};

export const DeleteFornecedorRequest = (IdFornecedor: Number) => {
  return axiosInstance
    .delete<number>(`DeleteFornecedor?pId=${IdFornecedor}`)
    .then((reponse) => reponse.data);
};
