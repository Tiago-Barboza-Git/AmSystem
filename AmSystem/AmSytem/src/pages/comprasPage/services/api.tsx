import { ICompra, IPostCompra, IPutCompra } from "@/interfaces/compra.interfaces";
import { IPutCompraPai } from "@/interfaces/compraPai.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/Compras/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetComprasRequest = (pCanceladas: boolean) => {
  return axiosInstance.get<ICompra[]>(`GetCompras?pCanceladas=${pCanceladas}`).then((reponse) => reponse.data);
};

export const PutCompraRequest = (Compra: IPutCompra) => {
  return axiosInstance.put<IPutCompra>("PutCompra", Compra).then((response) => response.data);
};

export const PostCompraRequest = (Compra: IPostCompra) => {
  return axiosInstance.post<IPostCompra>("PostCompra", Compra).then((response) => response.data);
};

export const DeleteCompraRequest = (IdCompra: number) => {
  return axiosInstance.delete<number>(`DeleteCompra?pId=${IdCompra}`).then((reponse) => reponse.data);
};

export const CancelCompraRequest = (Compra: IPutCompraPai) => {
  return axiosInstance
    .put<string>(
      `PutCancelarCompra?pNrNota=${Compra.nrNota}&pNrModelo=${Compra.nrModelo}&pNrSerie=${Compra.nrSerie}&pIdFornecedor=${Compra.idFornecedor}`,
    )
    .then((response) => {
      response.data;
    });
};

export const GetVerificaExistenciaCompraRequest = (
  nrNota: number,
  nrModelo: number,
  nrSerie: number,
  idFornecedor: number,
) => {
  return axiosInstance
    .get<boolean>(
      `GetVerificaExistenciaCompra?pNrNota=${nrNota}&pNrModelo=${nrModelo}&pNrSerie=${nrSerie}&pIdFornecedor=${idFornecedor}`,
    )
    .then((response) => response.data);
};
