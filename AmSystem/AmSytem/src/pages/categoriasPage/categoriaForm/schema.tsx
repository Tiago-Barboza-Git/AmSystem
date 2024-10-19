import { z } from "zod";

export const CategoriaFormSchema = z.object({
  id: z.number(),
  categoria: z
    .string({ message: "Obrigatório" })
    .min(1, "Obrigatório")
    .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
  descricao: z.string().default(""),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type CategoriaFormData = z.infer<typeof CategoriaFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
