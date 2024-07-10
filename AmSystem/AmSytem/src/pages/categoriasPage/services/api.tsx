import {
  ICategoria,
  IPostCategoria,
  IPutCategoria,
} from "@/interfaces/categoria.interfaces";
import axios from "axios";

const BASE_URL = "https://localhost:7248/";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const GetCategoriasRequest = (Ativos: boolean) => {
  return axiosInstance
    .get<ICategoria[]>(`GetCategorias?pAtivo=${Ativos}`)
    .then((reponse) => reponse.data);
};

export const PutCategoriaRequest = (Categoria: IPutCategoria) => {
  return axiosInstance
    .put<IPutCategoria>("PutCategoria", Categoria)
    .then((response) => response.data);
};

export const PostCategoriaRequest = (Categoria: IPostCategoria) => {
  return axiosInstance
    .post<IPostCategoria>("PostCategoria", Categoria)
    .then((response) => response.data);
};

export const DeleteCategoriaRequest = (IdCategoria: Number) => {
  return axiosInstance
    .delete<number>(`DeleteCategoria?pId=${IdCategoria}`)
    .then((reponse) => reponse.data);
};
