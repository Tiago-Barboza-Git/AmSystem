import { INotaDetails, INotaModel, IPostNota } from "../Nota/nota.interfaces";
import { IClienteRef } from "../cliente.interfaces";
import { IFuncionarioRef } from "../funcionario.interfaces";
import { IContaReceber, IPostContaReceber } from "./contasReceber..interfaces";
import { IPostProdutoVenda, IProdutoVenda } from "./produtoVenda.interfaces";

export interface IVenda extends INotaModel {
  idCliente: number;
  cliente: IClienteRef;
  percDesconto: number;
  idFuncionario: number;
  funcionario: IFuncionarioRef;
  produtos: IProdutoVenda[];
  contasReceber: IContaReceber[];
}

export interface IPostVenda extends IPostNota {
  idCliente: number;
  produtos: IPostProdutoVenda[];
  contasReceber: IPostContaReceber[];
}

export interface IVendaDetails extends INotaDetails {
  idCliente: number;
}

export const initialVenda: IVenda = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idCliente: 0,
  cliente: {
    id: 0,
    pessoaRazaoSocial: "",
  },
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
  percDesconto: 0,
  funcionario: {
    id: 0,
    funcionario: "",
  },
  idFuncionario: 0,
};
