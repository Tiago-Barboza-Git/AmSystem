export interface IFormaPagamento {
  id: number;
  formaPagamento: string;
  ativo: boolean;
  dtCadastro: Date;
  dtAlteracao: Date;
}

export interface IPostFormaPagamento {
  formaPagamento: string;
  ativo: boolean;
}

export interface IPutFormaPagamento {
  id: number;
  formaPagamento: string;
  ativo: boolean;
}
