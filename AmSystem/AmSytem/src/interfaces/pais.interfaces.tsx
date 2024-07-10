export interface IPais {
  id?: number;
  pais: string;
  ddi: number;
  sigla: string;
  ativo: boolean;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPostPais {
  pais: string;
  ddi: number;
  sigla: string;
  ativo: boolean;
}

export interface IPutPais {
  id?: number;
  pais: string;
  ddi: number;
  sigla: string;
  ativo: boolean;
}
