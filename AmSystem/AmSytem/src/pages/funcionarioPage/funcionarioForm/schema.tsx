import { formatDate } from "@/functions/functions";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const FuncionarioFormSchema = z.object({
  id: z.number(),
  funcionario: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
      "É permitido apenas letras, acentos e espaços"
    ),
  apelido: z.string().optional(),
  sexo: z.string(),
  email: z.string(),
  telefone: z.string().optional(),
  celular: z.string(),
  cpf: z.string(),
  rg: z.string().optional(),
  dtNascimento: z.custom<Date>().optional(),
  salario: z.union([z.string(), z.number()]).optional(),
  pis: z.string().optional(),
  cep: z.string(),
  logradouro: z.string(),
  bairro: z.string(),
  numero: z.number(),
  complemento: z.string().optional(),
  cargo: z.string().optional(),
  idCidade: z.number().refine((value) => value !== 0, {
    message: "Selecione uma cidade",
  }),
  cidade: z.custom<ICidade>(),
  ativo: z.boolean(),
  dtAdmissao: z.custom<Date>().optional(),
  dtDemissao: z.custom<Date>().optional(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type FuncionarioFormData = z.infer<typeof FuncionarioFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
