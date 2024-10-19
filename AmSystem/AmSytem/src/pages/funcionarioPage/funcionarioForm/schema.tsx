import { formatDate, formatMoney } from "@/functions/functions";
import { validarCPF } from "@/functions/validates";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const FuncionarioFormSchema = z
  .object({
    id: z.number(),
    funcionario: z
      .string({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
    apelido: z.string().optional(),
    sexo: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    email: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    telefone: z.string().optional(),
    celular: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    // cpf: z.string().default(""),
    cpf: z.preprocess((val) => String(val ? val : ""), z.string()),
    rg: z.string().optional(),
    dtNascimento: z.custom<Date>().optional(),
    salario: z
      .preprocess((val) => Number(formatMoney(String(val))), z.number())
      .refine((value) => !Number.isNaN(value), "Deve ser 0 ou maior"),
    pis: z.string().optional(),
    cep: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    logradouro: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    bairro: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    numero: z.number({ message: "Obrigatório" }).min(1, "Obrigatório"),
    complemento: z.string().optional(),
    cargo: z.string().optional(),
    idCidade: z.number({ message: "Obrigatório" }).refine((value) => value !== 0, {
      message: "Obrigatório",
    }),
    cidade: z.custom<ICidade>(),
    ativo: z.boolean(),
    dtAdmissao: z.custom<Date>().optional(),
    dtDemissao: z.custom<Date>().optional(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    console.log("Olha a data");
    console.log(data);
    if (data.cidade.cidade !== undefined) {
      if (data.cidade.estado.pais.sigla.toUpperCase() === "BR") {
        if (data.cpf.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Obrigatório",
            path: ["cpf"],
          });
        }
        if (!validarCPF(String(data.cpf))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "CPF inválido",
            path: ["cpf"],
          });
        }
      }
    }
  });

export type FuncionarioFormData = z.infer<typeof FuncionarioFormSchema>;

export const defaultValues = {
  id: 0,
  funcionario: "",
  apelido: "",
  sexo: "",
  email: "",
  telefone: "",
  celular: "",
  cpf: "",
  rg: "",
  salario: 0,
  pis: "",
  cep: "",
  logradouro: "",
  bairro: "",
  numero: 0,
  complemento: "",
  cargo: "",
  idCidade: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
