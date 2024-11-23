import { iCliente } from "../cliente.interfaces";
import { ICondicaoPagamento } from "../condicaoPagamento.interfaces";
import { IContaNota, IPostContaNota, IPutContaNota } from "../Nota/contaNota.interfaces";
import { IFormaPagamento } from "../formaPagamento.interfaces";

export interface IContaReceber extends IContaNota {
  idCliente: number;
  cliente: iCliente;
}

export interface IPostContaReceber extends IPostContaNota {}

export interface IPutContaReceber extends IPutContaNota {
  idCliente: number;
}
