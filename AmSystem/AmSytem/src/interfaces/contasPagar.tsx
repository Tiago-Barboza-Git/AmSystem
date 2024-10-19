import { ICompraPai, IPostCompraPai, IPutCompraPai } from "./compraPai.interfaces";
import { ICondicaoPagamento } from "./condicaoPagamento.interfaces";
import { IFormaPagamento } from "./formaPagamento.interfaces";
import { IFornecedor } from "./fornecedor.interfaces";

export interface IContaPagar extends ICompraPai {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dtEmissao: Date;
  dtVencimento: Date;
  dtPagamento?: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  valorPago: number | string;
  observacao: string;
  formaPagamento?: IFormaPagamento;
  condicaoPagamento: ICondicaoPagamento;
  dtCadastro: Date;
  dtAlteracao: Date;
  cancelada: boolean;
}

export interface IPutContaPagar extends IPutCompraPai {
  idFormaPagamento: number;
  numParcela: number;
  dtPagamento?: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  valorPago: number | string;
  observacao: string;
}

export interface IPostContaPagar {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dtVencimento: Date;
  formaPagamento: IFormaPagamento;
}
