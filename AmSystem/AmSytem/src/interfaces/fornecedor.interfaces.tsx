import { DateObject } from "react-multi-date-picker";
import { ICidade } from "./cidade.interfaces";

export interface IFornecedor {
  id: number;
  tpFornecedor: string;
  fornecedorRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  representante?: string;
  celularRepresentante?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  endereco: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  ativo: boolean;
  idCidade: number;
  cidade: ICidade;
  dtNascimento?: Date;
  dtCadastro?: Date;
  dtAlteracao?: Date;
}

export interface IPutFornecedor {
  id: number;
  tpFornecedor: string;
  fornecedorRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  representante?: string;
  celularRepresentante?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  endereco: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  dtNascimento?: Date;
  ativo: boolean;
  idCidade: number;
}

export interface IPostFornecedor {
  tpFornecedor: string;
  fornecedorRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  representante?: string;
  celularRepresentante?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  endereco: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  dtNascimento?: Date;
  ativo: boolean;
  idCidade: number;
}
