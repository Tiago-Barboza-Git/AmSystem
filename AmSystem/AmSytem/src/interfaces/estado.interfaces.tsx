import { IPais } from "./pais.interfaces";

export interface IEstado {
  id: number;
  estado: string;
  uf: string;
  ativo: boolean;
  idPais: number;
  pais: IPais;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPutEstado {
  id: number;
  estado: string;
  uf: string;
  ativo: boolean;
  idPais: number;
}

export interface IPostEstado {
  estado: string;
  uf: string;
  ativo: boolean;
  idPais: number;
}
