import {
  ICondicaoPagamento,
  IPostCondicaoPagamento,
  IPutCondicaoPagamento,
} from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar, IPutContaPagar } from "@/interfaces/contasPagar";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetContasPagarRequest = (Ativos: boolean) => {
  return axiosInstance.get<IContaPagar[]>(`GetContasPagar?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutContaPagarRequest = (ContaPagar: IPutContaPagar) => {
  return axiosInstance.put<IPutContaPagar>("PutContaPagar", ContaPagar).then((response) => response.data);
};
