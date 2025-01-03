import { iCliente } from "@/interfaces/cliente.interfaces";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { z } from "zod";

export const ContasReceberFormSchema = z
  .object({
    nrNota: z.number(),
    nrModelo: z.number(),
    nrSerie: z.number(),
    idCliente: z.number(),
    idFormaPagamento: z.number(),
    numParcela: z.number(),
    valorParcela: z.union([z.string(), z.number()]),
    dtEmissao: z.custom<Date>(),
    dtVencimento: z.custom<Date>(),
    dtPagamento: z.custom<Date>(),
    juros: z.union([z.string(), z.number()]),
    multa: z
      .union([z.string(), z.number()])
      .optional()
      .transform((value) => (value === undefined || isNaN(Number(value)) ? 0 : value)),
    desconto: z.union([z.string(), z.number()]),
    valorPago: z.union([z.string(), z.number()]),
    observacao: z
      .string()
      .optional()
      .transform((value) => (value === undefined || value === null || isNaN(Number(value)) ? "" : value)),
    cancelada: z.boolean(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
    cliente: z.custom<iCliente>(),
    formaPagamento: z.custom<IFormaPagamento>(),
    condicaoPagamento: z.custom<ICondicaoPagamento>(),
  })
  .superRefine((data, ctx) => {});

export type ContasReceberFormData = z.infer<typeof ContasReceberFormSchema>;

export const defaultValues = {
  observacao: "",
};
