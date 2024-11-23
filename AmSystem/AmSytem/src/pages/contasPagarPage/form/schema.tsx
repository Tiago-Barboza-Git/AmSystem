import { formatMoney } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
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
    valorParcela: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    dtEmissao: z.custom<Date>(),
    dtVencimento: z.custom<Date>(),
    dtPagamento: z.custom<Date>(),
    dtCancelamento: z.custom<Date>().optional(),
    juros: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    multa: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    desconto: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    valorPago: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    observacao: z
      .string()
      .optional()
      .transform((value) => (value === undefined ? "" : value)),
    cancelada: z.boolean(),
    avulsa: z.boolean().optional(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
    fornecedor: z.custom<IFornecedor>(),
    formaPagamento: z.custom<IFormaPagamento>(),
    condicaoPagamento: z.custom<ICondicaoPagamento>(),
  })
  .superRefine((data, ctx) => {});

export type ContaPagarFormData = z.infer<typeof ContaPagarFormSchema>;

export const defaultValues = {
  observacao: "",
};
