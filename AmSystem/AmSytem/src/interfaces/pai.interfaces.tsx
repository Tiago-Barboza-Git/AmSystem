export interface IPai {
  id: number;
  ativo: boolean;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPaiPost {
  ativo: boolean;
}

export interface IPaiPut {
  id: number;
  ativo: boolean;
}
