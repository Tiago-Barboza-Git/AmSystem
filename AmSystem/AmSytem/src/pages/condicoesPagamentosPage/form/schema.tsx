import { IEstado } from "@/interfaces/estado.interfaces";
import { IParcela } from "@/interfaces/parcela.interfaces";
import { z } from "zod";

export const CondicaoPagamentoFormSchema = z
  .object({
    id: z.number(),
    condicaoPagamento: z.string({ message: "Obrigatório" }),
    desconto: z.union([z.string(), z.number()]).default(0),
    juros: z.union([z.string(), z.number()]).default(0),
    multa: z.union([z.string(), z.number()]).default(0),
    ativo: z.boolean(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
    parcelas: z.custom<IParcela[]>(),
  })
  .superRefine((data, ctx) => {});

export type CondicaoPagamentoFormData = z.infer<typeof CondicaoPagamentoFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  condicaoPagamento: "",
  desconto: 0,
  juros: 0,
  multa: 0,
  parcelas: [],
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
