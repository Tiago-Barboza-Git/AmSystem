import { ICategoria } from "./categoria.interfaces";
import { IFornecedor } from "./fornecedor.interfaces";
import { IUnidadeMedida } from "./unidadeMedida.interfaces";

export interface IProduto {
  id: number;
  produto: string;
  quantidade: number;
  precoVenda: number;
  precoUltCompra: number;
  dtUltCompra?: Date;
  custoMedio: number;
  custoUnitUltimaCompra?: number;
  desconto: number;
  observacao?: string;
  ativo: boolean;
  idUnidadeMedida: number;
  idCategoria: number;
  idFornecedor?: number;
  dtCadastro: Date;
  dtAlteracao: Date;
  fornecedor?: IFornecedor;
  unidadeMedida: IUnidadeMedida;
  categoria: ICategoria;
}

export interface IPostProduto {
  produto: string;
  quantidade: number;
  precoVenda: number;
  precoUltCompra: number;
  dtUltCompra?: Date;
  custoMedio: number;
  desconto: number;
  observacao?: string;
  ativo: boolean;
  idFornecedor?: number;
  idUnidadeMedida: number;
  idCategoria: number;
}

export interface IPutProduto {
  id: number;
  produto: string;
  quantidade: number;
  precoVenda: number;
  precoUltCompra: number;
  dtUltCompra?: Date;
  custoMedio: number;
  desconto: number;
  observacao?: string;
  ativo: boolean;
  idFornecedor?: number | null;
  idUnidadeMedida: number;
  idCategoria: number;
}
