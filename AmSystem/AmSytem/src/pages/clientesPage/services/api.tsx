import { iCliente, iClientePost, iClientePut } from "@/interfaces/cliente.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetClientesRequest = (Ativos: boolean) => {
  return axiosInstance.get<iCliente[]>(`GetClientes?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutClienteRequest = (Estado: iClientePut) => {
  return axiosInstance.put<iClientePut>("PutCliente", Estado).then((response) => response.data);
};

export const PostClienteRequest = (Estado: iClientePost) => {
  return axiosInstance.post<iClientePost>("PostCliente", Estado).then((response) => response.data);
};

export const DeleteClienteRequest = (IdCliente: number) => {
  return axiosInstance.delete<number>(`DeleteCliente?pId=${IdCliente}`).then((reponse) => reponse.data);
};
