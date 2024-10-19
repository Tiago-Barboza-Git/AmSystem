import { IFornecedor } from "./fornecedor.interfaces";

export interface ICompraPai {
  nrNota?: number;
  nrModelo?: number;
  nrSerie?: number;
  idFornecedor?: number;
  fornecedor?: IFornecedor;
}

export interface IPutCompraPai {
  nrNota?: number;
  nrModelo?: number;
  nrSerie?: number;
  idFornecedor?: number;
}

export interface IPostCompraPai {
  nrNota?: number;
  nrModelo?: number;
  nrSerie?: number;
  idFornecedor?: number;
}
