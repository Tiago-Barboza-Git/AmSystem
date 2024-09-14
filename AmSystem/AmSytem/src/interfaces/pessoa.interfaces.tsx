import { number } from "zod";
import { ICidade } from "./cidade.interfaces";
import { IPai, IPaiPost, IPaiPut } from "./pai.interfaces";

export interface IPessoa extends IPai {
  tpPessoa: string;
  pessoaRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  dtNascimento?: Date;
  idCidade: number;
  cidade: ICidade;
}

export interface IPessoaPost extends IPaiPost {
  tpPessoa: string;
  pessoaRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  dtNascimento?: Date;
  idCidade: number;
  cidade: ICidade;
}

export interface IPessoaPut extends IPaiPut {
  tpPessoa: string;
  pessoaRazaoSocial: string;
  apelidoNomeFantasia?: string;
  sexo?: string;
  telefone?: string;
  celular: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cpfCnpj: string;
  ieRg?: string;
  dtNascimento?: Date;
  idCidade: number;
  cidade: ICidade;
}
