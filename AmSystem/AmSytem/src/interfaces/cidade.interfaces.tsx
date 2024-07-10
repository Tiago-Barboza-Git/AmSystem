import { IEstado } from "./estado.interfaces";

export interface ICidade {
  id: number;
  cidade: string;
  ddd: number;
  ativo: boolean;
  idEstado: number;
  estado: IEstado;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPutCidade {
  id: number;
  cidade: string;
  ddd: number;
  ativo: boolean;
  idEstado: number;
}

export interface IPostCidade {
  cidade: string;
  ddd: number;
  ativo: boolean;
  idEstado: number;
}
