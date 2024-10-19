import { ICompraPai } from "./compraPai.interfaces";
import { ICondicaoPagamento } from "./condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar } from "./contasPagar";
import { IFornecedorRef } from "./fornecedor.interfaces";
import { INotaModel, IPostNota } from "../interfaces/Nota/nota.interfaces";
import { IProdutoCompra, IPostProdutoCompra } from "./produtoCompra.interfaces";

export interface ICompra extends INotaModel {
  idFornecedor: number;
  fornecedor: IFornecedorRef;
  dtChegada: Date;
  produtos: IProdutoCompra[];
  tpFrete: string;
  frete: number;
  seguro: number;
  outrasDesp: number;
  totalCusto: number;
  contasPagar: IContaPagar[];
}

export const initialCompra: ICompra = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idFornecedor: 0,
  fornecedor: {
    id: 0,
    pessoaRazaoSocial: "",
  },
  dtEmissao: new Date(),
  dtChegada: new Date(),
  produtos: [],
  tpFrete: "",
  frete: 0,
  seguro: 0,
  outrasDesp: 0,
  totalCusto: 0,
  totalProdutos: 0,
  totalNota: 0,
  idCondicaoPagamento: 0,
  condicaoPagamento: {
    id: 0,
    condicaoPagamento: "",
  },
  contasPagar: [],
  dtCancelamento: undefined,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};

export interface IPostCompra extends IPostNota {
  idFornecedor: number;
  dtChegada: Date;
  produtos: IPostProdutoCompra[];
  tpFrete: string;
  frete: number;
  seguro: number;
  outrasDesp: number;
  totalCusto: number;
  contasPagar: IPostContaPagar[];
}

export interface IPutCompra {}
