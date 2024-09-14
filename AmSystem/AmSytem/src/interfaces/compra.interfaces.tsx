import { ICompraPai } from "./compraPai.interfaces";
import { ICondicaoPagamento } from "./condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar } from "./contasPagar";
import { IProdutoCompra, IPostProdutoCompra } from "./produtoCompra.interfaces";

export interface ICompra extends ICompraPai {
  dtEmissao: Date;
  dtChegada: Date;
  produtos: IProdutoCompra[];
  tpFrete?: string;
  frete: number | string;
  seguro: number | string;
  outrasDesp: number | string;
  totalCusto: number | string;
  totalProdutos: number | string;
  totalCompra: number | string;
  idCondicaoPagamento: number;
  condicaoPagamento: ICondicaoPagamento;
  contasPagar: IContaPagar[];
  dtCancelamento?: Date;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export const initialCompra: ICompra = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idFornecedor: 0,
  fornecedor: undefined,
  dtEmissao: new Date(),
  dtChegada: new Date(),
  produtos: [],
  tpFrete: undefined,
  frete: "0",
  seguro: "0",
  outrasDesp: "0",
  totalCusto: "0",
  totalProdutos: "0",
  totalCompra: "0",
  idCondicaoPagamento: 0,
  condicaoPagamento: {
    id: 0,
    condicaoPagamento: "",
    desconto: "0",
    juros: "0",
    multa: "0",
    ativo: true,
    dtCadastro: new Date(),
    dtAlteracao: new Date(),
    parcelas: [],
  },
  contasPagar: [],
  dtCancelamento: undefined,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};

export interface IPostCompra {
  nrNota?: number;
  nrModelo?: number;
  nrSerie?: number;
  idFornecedor?: number;
  dtEmissao: Date;
  dtChegada: Date;
  produtos: IPostProdutoCompra[];
  tpFrete?: string;
  frete: number | string;
  seguro: number | string;
  outrasDesp: number | string;
  totalCusto: number | string;
  totalProdutos: number | string;
  totalCompra: number | string;
  idCondicaoPagamento: number;
  contasPagar: IPostContaPagar[];
}

export interface IPutCompra {}

// setSelectedCompra({
//   nrNota: 0,
//   nrModelo: 0,
//   nrSerie: 0,
//   idFornecedor: 0,
//   fornecedor: undefined,
//   dtEmissao: new Date(), // Data a ser inserida pelo usuário
//   dtChegada: new Date(), // Data a ser inserida pelo usuário
//   produtos: [],
//   tpFrete: undefined,
//   frete: "0",
//   seguro: "0",
//   outrasDesp: "0",
//   totalCusto: "0",
//   totalProdutos: "0",
//   totalCompra: "0",
//   idCondicaoPagamento: 0,
//   condicaoPagamento: {
//     id: 0,
//     condicaoPagamento: "",
//     desconto: "0",
//     juros: "0",
//     multa: "0",
//     ativo: true,
//     dtCadastro: new Date(),
//     dtAlteracao: new Date(),
//     parcelas: [],
//   },
//   contasPagar: [],
//   dtCancelamento: undefined, // Data a ser inserida pelo usuário
//   dtCadastro: new Date(), // Inicializado com a data atual
// });
