import { IEstado } from "@/interfaces/estado.interfaces";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { IParcela } from "@/interfaces/parcela.interfaces";
import FormaPagamentoForm from "@/pages/formasPagamentosPage/form";
import { z } from "zod";

export const ParcelaFormSchema = z
  .object({
    id: z.number().optional(),
    numParcela: z.number().refine((value) => value > 0, "Obrigatório"),
    // dias: z.number().refine((value) => value > 0, "Obrigatório"),
    dias: z.number().optional(),
    porcentagem: z.union([z.string(), z.number()]),
    idFormaPagamento: z.number({ message: "Obrigatório" }).refine((value) => Number(value) > 0, "Obrigatório"),
    formaPagamento: z.custom<IFormaPagamento>(),
  })
  .superRefine((data, ctx) => {
    if (Number(data.porcentagem) <= 0 || isNaN(Number(data.porcentagem)))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["porcentagem"],
      });

    console.log(data.porcentagem);

    // if (Number(Number(data.porcentagem).toFixed(0)) > 0 && Number(Number(data.porcentagem).toFixed(0)) < 100)
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Obrigatório",
    //     path: ["dias"],
    //   });
  });

export type ParcelaFormData = z.infer<typeof ParcelaFormSchema>;

export const defaultValues = {
  id: 0,
  numParcela: 0,
  dias: 0,
  porcentagem: 0,
  idFormaPagamento: 0,
};
