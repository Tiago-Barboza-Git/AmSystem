import { ICompraPai } from "./compraPai.interfaces";
import { IFornecedor } from "./fornecedor.interfaces";
import { IProduto } from "./produto.interfaces";

export interface IProdutoCompra extends ICompraPai {
  quantidade: number;
  precoUnit: number;
  precoTotal: number;
  custoProd: number;
  custoUnit: number;
  rateio: number;
  idProduto: number;
  produto: IProduto;
}

export interface IPostProdutoCompra {
  quantidade: number;
  precoUnit: number;
  precoTotal: number;
  custoProd: number;
  custoUnit: number;
  rateio: number;
  idProduto: number;
}
