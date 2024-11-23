import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";
import {
  ICondicaoPagamento,
  IPostCondicaoPagamento,
  IPutCondicaoPagamento,
} from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagarAvulsa, IPutContaPagar } from "@/interfaces/contasPagar";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetContasPagarRequest = (Ativos: boolean) => {
  return axiosInstance.get<IContaPagar[]>(`GetContasPagar?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutContaPagarRequest = (ContaPagar: IPutContaPagar) => {
  return axiosInstance.put<IPutContaPagar>("PutContaPagar", ContaPagar).then((response) => response.data);
};

export const PostContaPagarAvulsaRequest = (ContaPagar: IPostContaPagarAvulsa) => {
  return axiosInstance
    .post<IPostContaPagarAvulsa>("PostContaPagarAvulsa", ContaPagar)
    .then((response) => response.data);
};

export const PutCondicaoPagamentoRequest = (CondicaoPagamento: IPutCondicaoPagamento) => {
  return axiosInstance
    .put<IPutCondicaoPagamento>("PutCondicaoPagamento", CondicaoPagamento)
    .then((response) => response.data);
};

export const PutCancelarContaPagarAvulsaRequest = (data: IPutCompraPai) => {
  return axiosInstance
    .put<string>(
      `PutCancelarContaPagarAvulsa?pNrNota=${data.nrNota}&pNrModelo=${data.nrModelo}&pNrSerie=${data.nrSerie}&pIdFornecedor=${data.idFornecedor}`,
    )
    .then((response) => response.data);
};
