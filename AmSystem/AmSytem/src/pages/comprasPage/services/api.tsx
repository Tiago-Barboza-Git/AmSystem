import { ICompra, IPostCompra, IPutCompra } from "@/interfaces/compra.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/Compras/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetCompraRequest = (nrNota?: number, nrModelo?: number, nrSerie?: number, idFornecedor?: number) => {
  return axiosInstance
    .get<number>(`GetCompra`, {
      params: {
        pNrNota: nrNota,
        pNrModelo: nrModelo,
        pNrSerie: nrSerie,
        pIdFornecedor: idFornecedor,
      },
    })
    .then((response) => response.data);
};

export const GetComprasRequest = () => {
  return axiosInstance.get<ICompra[]>(`GetCompras`).then((reponse) => reponse.data);
};

export const PutCompraRequest = (Compra: IPutCompra) => {
  return axiosInstance.put<IPutCompra>("PutCompra", Compra).then((response) => response.data);
};

export const PostCompraRequest = (Compra: IPostCompra) => {
  console.log(`Dale Compra:`, Compra);
  return axiosInstance.post<IPostCompra>("PostCompra", Compra).then((response) => response.data);
};

export const DeleteCompraRequest = (IdCompra: number) => {
  return axiosInstance.delete<number>(`DeleteCompra?pId=${IdCompra}`).then((reponse) => reponse.data);
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
export const getExistenciaCompra = (nrNota: number, nrModelo: number, nrSerie: number, idFornecedor: number) =>
  axiosInstance
    .get(
      `GetVerificaExistenciaCompra?pNrNota=${nrNota}&pNrModelo=${nrModelo}&pNrSerie=${nrSerie}&pIdFornecedor=${idFornecedor}`,
    )
    .then(({ data }) => data);
