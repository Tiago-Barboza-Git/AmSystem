import { IFormaPagamento } from "../formaPagamento.interfaces";

export interface IContaNota {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idFormaPagamento: number;
  formaPagamento: IFormaPagamento;
  numParcela: number;
  valorParcela: number;
  dtEmissao: Date;
  dtVencimento: Date;
  dtPagamento: Date;
  juros: number;
  multa: number;
  desconto: number;
  observacao: string;
  cancelada: boolean;
  valorPago: number;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostContaNota {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number;
  dtVencimento: Date;
}

export interface IPutContaNota {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number;
  dtPagamento: Date;
  juros: number;
  multa: number;
  desconto: number;
  valorPago: number;
  observacao: number;
}
