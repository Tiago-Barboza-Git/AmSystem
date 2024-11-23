import { ICompraPai, IPostCompraPai, IPutCompraPai } from "./compraPai.interfaces";
import { ICondicaoPagamento } from "./condicaoPagamento.interfaces";
import { IFormaPagamento } from "./formaPagamento.interfaces";
import { IFornecedor } from "./fornecedor.interfaces";

export interface IContaPagar extends ICompraPai {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number;
  dtEmissao: Date;
  dtVencimento?: Date;
  dtPagamento?: Date;
  dtCancelamento?: Date;
  juros: number;
  multa: number;
  desconto: number;
  valorPago: number;
  observacao: string;
  formaPagamento?: IFormaPagamento;
  condicaoPagamento: ICondicaoPagamento;
  dtCadastro: Date;
  dtAlteracao: Date;
  cancelada: boolean;
  avulsa?: boolean;
}

export interface IPutContaPagar extends IPutCompraPai {
  idFormaPagamento: number;
  numParcela: number;
  dtPagamento?: Date;
  juros: number;
  multa: number;
  desconto: number;
  valorPago: number;
  observacao: string;
}

export interface IPostContaPagar {
  idFormaPagamento: number;
  numParcela: number;
  valorParcela: number;
  dtVencimento: Date;
  formaPagamento: IFormaPagamento;
}

export interface IPostContaPagarAvulsa {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idFornecedor: number;
  numParcela: number;
  valorParcela: number;
  idFormaPagamento: number;
  juros: number;
  desconto: number;
  multa: number;
  valorPago: number;
  dtEmissao: Date;
  dtVencimento: Date;
  dtPagamento: Date;
  observacao: string;
}

export const initialContaPagar: IContaPagar = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idFornecedor: 0,
  fornecedor: {} as IFornecedor,
  idFormaPagamento: 0,
  formaPagamento: {} as IFormaPagamento,
  numParcela: 1,
  dtEmissao: new Date(),
  dtVencimento: new Date(),
  dtPagamento: new Date(),
  juros: 0,
  multa: 0,
  desconto: 0,
  valorPago: 0,
  observacao: "",
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
  valorParcela: 0,
  condicaoPagamento: {} as ICondicaoPagamento,
  cancelada: false,
  avulsa: false,
};
