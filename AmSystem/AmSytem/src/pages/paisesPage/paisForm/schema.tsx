import { formatDate } from "@/functions/functions";
import { z } from "zod";

export const PaisFormSchema = z.object({
  id: z.number(),
  pais: z
    .string()
    .min(1, "O nome do estado é obrigatório!!!")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  ddi: z.number().refine((value) => value !== 0, {
    message: "Digite o DDI do País",
  }),
  sigla: z
    .string()
    .min(1, "A sigla do pais é obrigatória!!!")
    .max(5, "Só é permitido 5 caracteres")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type PaisFormData = z.infer<typeof PaisFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
