import { ICidade, IPostCidade, IPutCidade } from "@/interfaces/cidade.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetCidadesRequest = (Ativos: boolean) => {
  return axiosInstance.get<ICidade[]>(`GetCidades?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutCidadeRequest = (Cidade: IPutCidade) => {
  return axiosInstance.put<IPutCidade>("PutCidade", Cidade).then((response) => response.data);
};

export const PostCidadeRequest = (Cidade: IPostCidade) => {
  return axiosInstance.post<IPostCidade>("PostCidade", Cidade).then((response) => response.data);
};

export const DeleteCidadeRequest = (IdCidade: number) => {
  return axiosInstance.delete<number>(`DeleteCidade?pId=${IdCidade}`).then((reponse) => reponse.data);
};
