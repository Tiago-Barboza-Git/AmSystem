import { ICondicaoPagamentoRef } from "../condicaoPagamento.interfaces";

export interface INotaModel {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  dtEmissao: Date;
  totalProdutos: number;
  totalNota: number;
  idCondicaoPagamento: number;
  condicaoPagamento: ICondicaoPagamentoRef;
  dtCancelamento?: Date;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostNota {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  dtEmissao: Date;
  totalProdutos: number;
  totalNota: number;
  idCondicaoPagamento: number;
}
