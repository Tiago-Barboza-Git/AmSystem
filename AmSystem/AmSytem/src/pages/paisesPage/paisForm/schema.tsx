import { formatDate } from "@/functions/functions";
import { z } from "zod";

export const PaisFormSchema = z.object({
  id: z.number(),
  pais: z
    .string({ message: "Obrigatório" })
    .min(1, "Obrigatório")
    .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
  ddi: z.number({ message: "Obrigatório" }).refine((value) => value !== 0, {
    message: "Digite o DDI do País",
  }),
  sigla: z
    .string({ message: "Obrigatório" })
    .min(1, "Obrigatório")
    .max(5, "Só é permitido 5 caracteres")
    .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type PaisFormData = z.infer<typeof PaisFormSchema>;

export const defaultValues = {
  id: 0,
  pais: "",
  ddi: 0,
  sigla: "",
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
