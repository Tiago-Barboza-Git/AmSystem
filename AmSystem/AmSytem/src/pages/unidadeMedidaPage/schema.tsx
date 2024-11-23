import { z } from "zod";

export const UnidadeMedidaFormSchema = z.object({
  id: z.number(),
  unidadeMedida: z
    .string({ message: "Obrigatório" })
    .min(1, "Obrigatório")
    .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
  simbolo: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type UnidadeMedidaFormData = z.infer<typeof UnidadeMedidaFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
