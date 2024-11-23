import { IContaReceber, IPutContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";
import {
  ICondicaoPagamento,
  IPostCondicaoPagamento,
  IPutCondicaoPagamento,
} from "@/interfaces/condicaoPagamento.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetContasReceberRequest = (Ativos: boolean) => {
  return axiosInstance.get<IContaReceber[]>(`GetContasReceber?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutContaReceberRequest = (ContaReceber: IPutContaReceber) => {
  return axiosInstance.put<IPutContaReceber>("PutContaReceber", ContaReceber).then((response) => response.data);
};
