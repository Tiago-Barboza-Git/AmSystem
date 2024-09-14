import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { z } from "zod";

export const ContaPagarFormSchema = z
  .object({
    nrNota: z.number(),
    nrModelo: z.number(),
    nrSerie: z.number(),
    idFornecedor: z.number(),
    idFormaPagamento: z.number(),
    numParcela: z.number(),
    valorParcela: z.union([z.string(), z.number()]),
    dtEmissao: z.custom<Date>(),
    dtVencimento: z.custom<Date>(),
    dtPagamento: z.custom<Date>(),
    juros: z.union([z.string(), z.number()]),
    multa: z.union([z.string(), z.number()]),
    desconto: z.union([z.string(), z.number()]),
    valorPago: z.union([z.string(), z.number()]),
    observacao: z.string(),
    ativo: z.boolean(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
    fornecedor: z.custom<IFornecedor>(),
    formaPagamento: z.custom<IFormaPagamento>(),
  })
  .superRefine((data, ctx) => {});

export type ContaPagarFormData = z.infer<typeof ContaPagarFormSchema>;
