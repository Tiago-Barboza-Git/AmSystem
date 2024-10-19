import { IFuncionario, IPostFuncionario, IPutFuncionario } from "@/interfaces/funcionario.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetFuncionariosRequest = (Ativos: boolean) => {
  return axiosInstance.get<IFuncionario[]>(`GetFuncionarios?pAtivo=${Ativos}`).then((reponse) => reponse.data);
};

export const PutFuncionarioRequest = (Funcionario: IPutFuncionario) => {
  return axiosInstance.put<IPutFuncionario>("PutFuncionario", Funcionario).then((response) => response.data);
};

export const PostFuncionarioRequest = (Funcionario: IPostFuncionario) => {
  return axiosInstance.post<IPostFuncionario>("PostFuncionario", Funcionario).then((response) => response.data);
};

export const DeleteFuncionarioRequest = (IdFuncionario: number) => {
  return axiosInstance.delete<number>(`DeleteFuncionario?pId=${IdFuncionario}`).then((reponse) => reponse.data);
};
