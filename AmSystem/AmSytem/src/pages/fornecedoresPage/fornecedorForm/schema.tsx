import { formatDate } from "@/functions/functions";
import { validarCPF, validarCNPJ } from "@/functions/validates";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const FornecedorFormSchema = z
  .object({
    id: z.number(),
    tpPessoa: z.string(),
    pessoaRazaoSocial: z
      .string({ message: "Obrigatório" })
      .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
    apelidoNomeFantasia: z
      .string()
      .regex(/^([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*)$/, "É permitido apenas letras, acentos e espaços")
      .optional(),
    sexo: z.string().optional(),
    representante: z
      .string()
      .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/, "É permitido apenas letras, acentos e espaços")
      .optional(),

    celularRepresentante: z.string().optional(),
    telefone: z.string().optional(),
    celular: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    email: z.string({ message: "Obrigatório" }).email("Email inválido"),
    cep: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    logradouro: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    numero: z.number().refine((e) => e > 0, {
      message: "Obrigatório",
    }),
    complemento: z.string().optional(),
    bairro: z.string({ message: "Obrigatório" }).min(1, "Obrigatório"),
    cpfCnpj: z.string().default(""),
    ieRg: z
      .string()
      .transform((value) => String(value))
      .optional(),
    dtNascimento: z.custom<Date>().optional(),
    ativo: z.boolean(),
    idCidade: z.number({ message: "Obrigatório" }).refine((value) => value > 0, {
      message: "Obrigatório",
    }),
    cidade: z.custom<ICidade>(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    //Sexo obrigatório, caso o tipo de cliente seja pessoa física
    if (data.tpPessoa === "F" && (!data.sexo || (data.sexo !== "F" && data.sexo !== "M"))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["sexo"],
      });
    }

    //Validação de CPF e CNPJ
    if (data.cidade.cidade !== undefined) {
      if (data.cidade.estado.pais.sigla.toUpperCase() === "BR") {
        if (data.cpfCnpj.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Obrigatório",
            path: ["cpfCnpj"],
          });
        } else {
          if (data.tpPessoa === "F") {
            if (!validarCPF(String(data.cpfCnpj))) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF inválido",
                path: ["cpfCnpj"],
              });
            }
          } else {
            if (!validarCNPJ(String(data.cpfCnpj))) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CNPJ inválido",
                path: ["cpfCnpj"],
              });
            } else {
              data.cpfCnpj.replace(".", "").replace("/", "").replace("-", "");
            }
          }
        }
      }
    }
  });
export type FornecedorFormData = z.infer<typeof FornecedorFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  numero: 0,
  sexo: undefined,
  tpPessoa: "F",
  pessoaRazaoSocial: "",
  apelidoNomeFantasia: "",
  representante: "",
  celularRepresentante: "",
  telefone: "",
  celular: "",
  email: "",
  cep: "",
  logradouro: "",
  complemento: "",
  bairro: "",
  cpfCnpj: "",
  ieRg: "",
  idCidade: 0,
  cidade: undefined,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};

export const FornecedorRefFormSchema = z.object({
  id: z.number(),
  pessoaRazaoSocial: z
    .string({ message: "Obrigatório" })
    .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
});
