export interface ICategoria {
  id: number;
  categoria: string;
  descricao: string;
  ativo: boolean;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPostCategoria {
  categoria: string;
  descricao: string;
  ativo: boolean;
}

export interface IPutCategoria {
  id: number;
  categoria: string;
  descricao: string;
  ativo: boolean;
}
