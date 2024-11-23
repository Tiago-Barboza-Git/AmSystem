import { ICompra, IPostCompra, IPutCompra } from "@/interfaces/compra.interfaces";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";
import { IPostVenda, IPutVenda, IVenda, IVendaRequest } from "@/interfaces/Venda/venda.interface";
import axios from "axios";

const BASE_URL = "https://localhost:7248/Vendas/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetVendasRequest = (pCanceladas: boolean) => {
  return axiosInstance.get<IVendaRequest>(`GetVendas?pCanceladas=${pCanceladas}`).then((reponse) => reponse.data);
};

export const PostVendaRequest = (Venda: IPostVenda) => {
  return axiosInstance.post<IPostVenda>("PostVenda", Venda).then((response) => response.data);
};

export const CancelVendaRequest = (venda: IPutVenda) => {
  return axiosInstance
    .put<string>(
      `PutCancelarVenda?pNrNota=${venda.nrNota}&pNrModelo=${venda.nrModelo}&pNrSerie=${venda.nrSerie}&pIdCliente=${venda.idCliente}`,
    )
    .then((response) => {
      response.data;
    });
};

export const VerificaVendaRequest = async (nrNota: number, nrModelo: number, nrSerie: number, idCliente: number) => {
  return await axiosInstance
    .get<boolean>(
      `GetVerificaExistenciaVenda?pNrNota=${nrNota}&pNrModelo=${nrModelo}&pNrSerie=${nrSerie}&pIdCliente=${idCliente}`,
    )
    .then((response) => response.data);
};
