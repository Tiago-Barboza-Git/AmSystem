import {
  IUnidadeMedida,
  IPostUnidadeMedida,
  IPutUnidadeMedida,
} from "@/interfaces/unidadeMedida.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetUnidadesMedidasRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<IUnidadeMedida[]>(`GetUnidadesMedidas?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutUnidadeMedidaRequest = (UnidadeMedida: IPutUnidadeMedida) => {
  return axiosInstance
    .put<IPutUnidadeMedida>("PutUnidadeMedida", UnidadeMedida)
    .then((response) => response.data);
};

export const PostUnidadeMedidaRequest = (UnidadeMedida: IPostUnidadeMedida) => {
  return axiosInstance
    .post<IPostUnidadeMedida>("PostUnidadeMedida", UnidadeMedida)
    .then((response) => response.data);
};

export const DeleteUnidadeMedidaRequest = (IdUnidadeMedida: Number) => {
  return axiosInstance
    .delete<number>(`DeleteUnidadeMedida?pId=${IdUnidadeMedida}`)
    .then((reponse) => reponse.data);
};
