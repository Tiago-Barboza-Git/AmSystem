import { iCliente } from "../cliente.interfaces";
import { IProduto } from "../produto.interfaces";
import { IPostProdutoNota } from "../Nota/produtoNota.interfaces";

export interface IProdutoVenda {
  quantidade: number;
  precoUnit: number;
  precoTotal: number;
  idProduto: number;
  produto: IProduto;
}

export interface IPostProdutoVenda extends IPostProdutoNota {}
