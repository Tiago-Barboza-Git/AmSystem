import { ICidade } from "./cidade.interfaces";

export interface IFuncionario {
  id: number;
  funcionario: string;
  apelido?: string;
  sexo: string;
  telefone?: string;
  email: string;
  celular: string;
  cpf: string;
  rg?: string;
  dtNascimento?: Date;
  salario: number;
  pis?: string;
  cep: string;
  logradouro: string;
  bairro: string;
  numero: number;
  complemento?: string;
  cargo?: string;
  ativo: boolean;
  idCidade: number;
  dtAdmissao?: Date;
  dtDemissao?: Date;
  dtCadastro: Date;
  dtAlteracao: Date;
  cidade: ICidade;
}

export interface IPutFuncionario {
  id: number;
  funcionario: string;
  apelido?: string;
  cpf: string;
  rg?: string;
  dtNascimento?: Date;
  email: string;
  telefone?: string;
  celular: string;
  salario: number;
  pis?: string;
  cep: string;
  logradouro: string;
  bairro: string;
  numero: number;
  complemento?: string;
  sexo: string;
  cargo?: string;
  ativo: boolean;
  idCidade: number;
  dtAdmissao?: Date;
  dtDemissao?: Date;
}

export interface IPostFuncionario {
  funcionario: string;
  apelido?: string;
  cpf: string;
  rg?: string;
  dtNascimento?: Date;
  email: string;
  telefone?: string;
  celular: string;
  salario: number;
  pis?: string;
  cep: string;
  logradouro: string;
  bairro: string;
  numero: number;
  complemento?: string;
  sexo: string;
  cargo?: string;
  ativo: boolean;
  idCidade: number;
  dtAdmissao?: Date;
  dtDemissao?: Date;
}

export interface IFuncionarioRef {
  id: number;
  funcionario: string;
}
