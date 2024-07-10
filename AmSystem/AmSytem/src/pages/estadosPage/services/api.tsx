import {
  IEstado,
  IPostEstado,
  IPutEstado,
} from "@/interfaces/estado.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetEstadosRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<IEstado[]>(`GetEstados?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutEstadoRequest = (Estado: IPutEstado) => {
  return axiosInstance
    .put<IPutEstado>("PutEstado", Estado)
    .then((response) => response.data);
};

export const PostEstadoRequest = (Estado: IPostEstado) => {
  return axiosInstance
    .post<IPostEstado>("PostEstado", Estado)
    .then((response) => response.data);
};

export const DeleteEstadoRequest = (IdEstado: Number) => {
  return axiosInstance
    .delete<number>(`DeleteEstado?pId=${IdEstado}`)
    .then((reponse) => reponse.data);
};
