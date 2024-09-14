import { IFornecedor } from "./fornecedor.interfaces";

export interface ICompraPai {
  nrNota?: number;
  nrModelo?: number;
  nrSerie?: number;
  idFornecedor?: number;
  fornecedor?: IFornecedor;
}
