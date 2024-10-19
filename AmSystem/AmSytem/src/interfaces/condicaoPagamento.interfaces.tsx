import { IParcela } from "./parcela.interfaces";

export interface ICondicaoPagamento {
  id: number;
  condicaoPagamento: string;
  desconto: number | string;
  juros: number | string;
  multa: number | string;
  ativo: boolean;
  dtCadastro: Date;
  dtAlteracao: Date;
  parcelas: IParcela[];
}

export const initialCondicaoPagamento: ICondicaoPagamento = {
  id: 0,
  condicaoPagamento: "",
  desconto: 0,
  juros: 0,
  multa: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
  parcelas: [],
};

export interface IPostCondicaoPagamento {
  condicaoPagamento: string;
  desconto?: number | string;
  juros?: number | string;
  multa?: number | string;
  ativo: boolean;
  parcelas: IParcela[];
}

export interface IPutCondicaoPagamento {
  id: number;
  condicaoPagamento: string;
  desconto?: number | string;
  juros?: number | string;
  multa?: number | string;
  ativo: boolean;
  parcelas: IParcela[];
}

export interface ICondicaoPagamentoRef {
  id: number;
  condicaoPagamento: string;
}
