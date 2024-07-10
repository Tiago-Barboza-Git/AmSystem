import {
  IFormaPagamento,
  IPostFormaPagamento,
  IPutFormaPagamento,
} from "@/interfaces/formaPagamento.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetFormasPagamentosRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<IFormaPagamento[]>(`GetFormasPagamentos?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutFormaPagamentoRequest = (
  FormaPagamento: IPutFormaPagamento
) => {
  return axiosInstance
    .put<IPutFormaPagamento>("PutFormaPagamento", FormaPagamento)
    .then((response) => response.data);
};

export const PostFormaPagamentoRequest = (
  FormaPagamento: IPostFormaPagamento
) => {
  return axiosInstance
    .post<IPostFormaPagamento>("PostFormaPagamento", FormaPagamento)
    .then((response) => response.data);
};

export const DeleteFormaPagamentoRequest = (IdFormaPagamento: Number) => {
  return axiosInstance
    .delete<number>(`DeleteFormaPagamento?pId=${IdFormaPagamento}`)
    .then((reponse) => reponse.data);
};
