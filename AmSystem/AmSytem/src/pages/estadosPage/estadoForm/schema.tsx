import { formatDate } from "@/functions/functions";
import { IPais } from "@/interfaces/pais.interfaces";
import { z } from "zod";

export const EstadoFormSchema = z.object({
  id: z.number(),
  estado: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  uf: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  idPais: z.number().refine((value) => value !== 0, {
    message: "Selecione um País",
  }),
  pais: z.custom<IPais>(),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type EstadoFormData = z.infer<typeof EstadoFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
