import { IProduto } from "../produto.interfaces";

export interface IProdutoNota {
  idProduto: number;
  quantidade: number;
  precoUnit: number;
  precoTotal: number;
  produto: IProduto;
}

export interface IPostProdutoNota {
  idProduto: number;
  quantidade: number;
  precoUnit: number;
  precoTotal: number;
}
