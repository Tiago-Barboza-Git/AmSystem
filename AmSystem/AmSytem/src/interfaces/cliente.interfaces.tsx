import { DateObject } from "react-multi-date-picker";
import { ICidade } from "./cidade.interfaces";
import { IPessoa, IPessoaPost, IPessoaPut } from "./pessoa.interfaces";

export interface iCliente extends IPessoa {
  representate?: string;
  celularRepresentante?: string;
}

export interface iClientePost extends IPessoaPost {
  representate?: string;
  celularRepresentante?: string;
}

export interface iClientePut extends IPessoaPut {
  representate?: string;
  celularRepresentante?: string;
}
