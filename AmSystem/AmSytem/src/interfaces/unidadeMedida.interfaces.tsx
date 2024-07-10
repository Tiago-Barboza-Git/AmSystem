export interface IUnidadeMedida {
  id: number;
  unidadeMedida: string;
  simbolo?: string;
  ativo: boolean;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPostUnidadeMedida {
  unidadeMedida: string;
  simbolo?: string;
  ativo: boolean;
}

export interface IPutUnidadeMedida {
  id: number;
  unidadeMedida: string;
  simbolo?: string;
  ativo: boolean;
}
