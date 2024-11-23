import { IFormaPagamento } from "./formaPagamento.interfaces";

export interface IParcela {
  id?: number;
  numParcela: number;
  dias?: number;
  porcentagem: number | string;
  idFormaPagamento: number;
  formaPagamento: IFormaPagamento;
}
