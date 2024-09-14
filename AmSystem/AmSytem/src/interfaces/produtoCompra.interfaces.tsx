import { ICompraPai } from "./compraPai.interfaces";
import { IProduto } from "./produto.interfaces";

export interface IProdutoCompra extends ICompraPai {
  quantidade: number;
  precoUnit: number | string;
  precoTotal: number | string;
  custoProd: number | string;
  custoUnit: number | string;
  rateio: number | string;
  idProduto: number;
  produto: IProduto;
}

export interface IPostProdutoCompra {
  quantidade: number;
  precoUnit: number | string;
  precoTotal: number | string;
  custoProd: number | string;
  custoUnit: number | string;
  rateio: number | string;
  idProduto: number;
}
