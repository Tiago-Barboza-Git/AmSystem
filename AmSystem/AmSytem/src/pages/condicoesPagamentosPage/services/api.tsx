import {
  ICondicaoPagamento,
  IPostCondicaoPagamento,
  IPutCondicaoPagamento,
} from "@/interfaces/condicaoPagamento.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetCondicoesPagamentosRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<ICondicaoPagamento[]>(`GetCondicoesPagamentos?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutCondicaoPagamentoRequest = (CondicaoPagamento: IPutCondicaoPagamento) => {
  return axiosInstance
    .put<IPutCondicaoPagamento>("PutCondicaoPagamento", CondicaoPagamento)
    .then((response) => response.data);
};

export const PostCondicaoPagamentoRequest = (CondicaoPagamento: IPostCondicaoPagamento) => {
  return axiosInstance
    .post<IPostCondicaoPagamento>("PostCondicaoPagamento", CondicaoPagamento)
    .then((response) => response.data);
};

export const DeleteCondicaoPagamentoRequest = (IdCondicaoPagamento: number) => {
  return axiosInstance
    .delete<number>(`DeleteCondicaoPagamento?pId=${IdCondicaoPagamento}`)
    .then((reponse) => reponse.data);
};
