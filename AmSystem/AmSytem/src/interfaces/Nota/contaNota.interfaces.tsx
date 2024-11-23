import { IFormaPagamento } from "../formaPagamento.interfaces";

export interface IContaNota {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idFormaPagamento: number;
  formaPagamento: IFormaPagamento;
  numParcela: number;
  valorParcela: number | string;
  dtEmissao: Date;
  dtVencimento: Date;
  dtPagamento: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  observacao: string;
  cancelada: boolean;
  valorPago: number | string;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostContaNota {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dtVencimento: Date;
}

export interface IPutContaNota {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dtPagamento: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  valorPago: number | string;
  observacao: string;
}
