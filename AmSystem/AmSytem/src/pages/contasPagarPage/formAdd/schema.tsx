import { formatMoney } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { z } from "zod";

export const ContaPagarFormSchema = z
  .object({
    nrNota: z.number().min(1, "Obrigatório"),
    nrModelo: z.number().min(1, "Obrigatório"),
    nrSerie: z.number().min(1, "Obrigatório"),
    idFornecedor: z.number().min(1, "Obrigatório"),
    idFormaPagamento: z.number().min(1, "Obrigatório"),
    numParcela: z
      .number()
      .min(1)
      .refine((value) => value > 0, "Obrigatório"),
    valorParcela: z.preprocess((val) => Number(formatMoney(String(val))), z.number().min(1, "Obrigatório")),
    dtEmissao: z.date({ message: "Obrigatório" }).max(new Date(), "A data de emissão não pode ser no futuro"),
    dtVencimento: z.date(),
    dtPagamento: z.date(),
    juros: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    multa: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    desconto: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    valorPago: z.preprocess((val) => Number(formatMoney(String(val))), z.number().min(1, "Obrigatório")),
    observacao: z
      .string()
      .optional()
      .transform((value) => (value === undefined ? "" : value)),
    cancelada: z.boolean(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
    fornecedor: z.custom<IFornecedor>(),
    formaPagamento: z.custom<IFormaPagamento>(),
    condicaoPagamento: z.custom<ICondicaoPagamento>(),
  })
  .superRefine((data, ctx) => {
    const normalizeDate = (date: Date) => {
      date.setHours(0, 0, 0, 0); // Remove as horas, minutos, segundos e milissegundos
      return date;
    };

    const dtVencimento = data.dtVencimento ? normalizeDate(new Date(data.dtVencimento as Date)) : undefined;
    const dtEmissao = normalizeDate(new Date(data.dtEmissao));
    const dtPagamento = data.dtPagamento ? normalizeDate(new Date(data.dtPagamento as Date)) : undefined;

    if (dtVencimento !== undefined && dtVencimento < dtEmissao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Não pode ser menor que emissão!",
        path: ["dtVencimento"],
      });
    }

    if (dtPagamento) {
      if (dtPagamento < dtEmissao) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Não pode ser menor que emissão!",
          path: ["dtPagamento"],
        });
      }
    }
  });

export type ContaPagarFormData = z.infer<typeof ContaPagarFormSchema>;

export const defaultValues = {
  observacao: "",
};
