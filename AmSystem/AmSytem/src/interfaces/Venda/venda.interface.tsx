import { INotaModel, IPostNota } from "../Nota/nota.interfaces";
import { IClienteRef, iCliente } from "../cliente.interfaces";
import { IFuncionarioRef } from "../funcionario.interfaces";
import { IContaReceber, IPostContaReceber } from "./contasReceber..interfaces";
import { IPostProdutoVenda, IProdutoVenda } from "./produtoVenda.interfaces";

export interface IVenda extends INotaModel {
  idCliente: number;
  cliente: iCliente;
  produtos: IProdutoVenda[];
  contasReceber: IContaReceber[];
}

export interface IVendaRequest {
  vendas: IVenda[];
  nextIdent: number;
}

export interface IPutVenda {
  nrNota: number;
  nrModelo: number;
  nrSerie: number;
  idCliente: number;
}

export interface IPostVenda extends IPostNota {
  idCliente: number;
  produtos: IPostProdutoVenda[];
  contasReceber: IPostContaReceber[];
}

export const initialVenda: IVenda = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idCliente: 0,
  cliente: {} as iCliente,
  dtEmissao: new Date(),
  produtos: [],
  totalProdutos: 0,
  totalNota: 0,
  idCondicaoPagamento: 0,
  condicaoPagamento: {
    id: 0,
    condicaoPagamento: "",
  },
  contasReceber: [],
  dtCancelamento: undefined,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
