import { IEstado } from "@/interfaces/estado.interfaces";
import { IParcela } from "@/interfaces/parcela.interfaces";
import { z } from "zod";

export const FormaPagamentoFormSchema = z.object({
  id: z.number(),
  formaPagamento: z
    .string({ message: "Obrigatório" })
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type FormaPagamentoFormData = z.infer<typeof FormaPagamentoFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
