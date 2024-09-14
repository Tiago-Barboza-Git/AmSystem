import { DateObject } from "react-multi-date-picker";
import { ICidade } from "./cidade.interfaces";
import { IPessoa, IPessoaPost, IPessoaPut } from "./pessoa.interfaces";

export interface IFornecedor extends IPessoa {
  representante?: string;
  celularRepresentante?: string;
}

export interface IPostFornecedor extends IPessoaPost {
  representante?: string;
  celularRepresentante?: string;
}

export interface IPutFornecedor extends IPessoaPut {
  representante?: string;
  celularRepresentante?: string;
}
