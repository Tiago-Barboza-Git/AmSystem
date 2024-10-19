import { IProduto, IPostProduto, IPutProduto } from "@/interfaces/produto.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetProdutosRequest = (Ativos: boolean) => {
  return axiosInstance.get<IProduto[]>(`GetProdutos?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutProdutoRequest = (produto: IPutProduto) => {
  return axiosInstance.put<IPutProduto>("PutProduto", produto).then((response) => response.data);
};

export const PostProdutoRequest = (produto: IPostProduto) => {
  return axiosInstance.post<IPostProduto>("PostProduto", produto).then((response) => response.data);
};

export const DeleteProdutoRequest = (idProduto: number) => {
  return axiosInstance.delete<number>(`DeleteProduto?pId=${idProduto}`).then((reponse) => reponse.data);
};
