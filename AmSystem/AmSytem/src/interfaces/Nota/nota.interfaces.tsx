import { ICondicaoPagamentoRef } from "../condicaoPagamento.interfaces";

export interface INotaModel extends INotaDetails {
  dtEmissao: Date;
  totalProdutos: number;
  totalNota: number;
  idCondicaoPagamento: number;
  condicaoPagamento: ICondicaoPagamentoRef;
  dtCancelamento?: Date;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostNota extends INotaDetails {
  dtEmissao: Date;
  totalProdutos: number;
  totalNota: number;
  idCondicaoPagamento: number;
}

export interface INotaDetails {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
}
