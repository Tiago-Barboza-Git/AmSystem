import { IPais, IPostPais, IPutPais } from "@/interfaces/pais.interfaces";
import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetPaisesRequest = (Ativos: boolean) => {
  return axiosInstance.get<IPais[]>(`GetPaises?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutPaisRequest = (Pais: IPutPais) => {
  return axiosInstance.put<IPutPais>("PutPais", Pais).then((response) => response.data);
};

export const PostPaisRequest = (Pais: IPostPais) => {
  return axiosInstance.post<IPostPais>("PostPais", Pais).then((response) => response.data);
};

export const DeletePaisRequest = (IdPais: number) => {
  return axiosInstance.delete<number>(`DeletePais?pId=${IdPais}`).then((reponse) => reponse.data);
};
