import { formatDate } from "@/functions/functions";
import { IEstado } from "@/interfaces/estado.interfaces";
import { z } from "zod";

export const CidadeFormSchema = z.object({
  id: z.number(),
  cidade: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  ddd: z.number().refine((value) => value !== 0, {
    message: "Digite o DDD da Cidade",
  }),
  idEstado: z.number().refine((value) => value !== 0, {
    message: "Selecione um Estado",
  }),
  estado: z.custom<IEstado>(),
  ativo: z.boolean(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type CidadeFormData = z.infer<typeof CidadeFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
