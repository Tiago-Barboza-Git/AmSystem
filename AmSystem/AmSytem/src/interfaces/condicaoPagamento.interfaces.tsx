import { IParcela } from "./parcela.interfaces";

export interface ICondicaoPagamento {
  id: number;
  condicaoPagamento: string;
  desconto?: number | string;
  juros?: number | string;
  multa?: number | string;
  ativo: boolean;
  dtCadastro: Date;
  dtAlteracao: Date;
  parcelas: IParcela[];
}

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
