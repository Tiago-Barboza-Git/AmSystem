import { ICompraPai } from "./compraPai.interfaces";
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
  valorTotal: number | string;
  formaPagamento?: IFormaPagamento;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostContaPagar {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dtEmissao: Date;
  dtVencimento: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  valorPago: number | string;
  valorTotal: number | string;
}

export interface IPutContaPagar extends ICompraPai {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number | string;
  dataEmissao: Date;
  dtVencimento: Date;
  dtPagamento: Date;
  juros: number | string;
  multa: number | string;
  desconto: number | string;
  valorPago: number | string;
  valorTotal: number | string;
}
