import { formatDate } from "@/functions/functions";
import { validarCPF, validarCNPJ } from "@/functions/validates";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const ClienteFormSchema = z
  .object({
    id: z.number(),
    tpPessoa: z.string(),
    pessoaRazaoSocial: z
      .string()
      .min(1, "Obrigatório")
      .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços")
      .transform((val) => val.slice(0, 100)),
    apelidoNomeFantasia: z
      .string()
      .regex(/^([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*)$/, "É permitido apenas letras, acentos e espaços")
      .optional(),
    sexo: z.string().optional(),
    representante: z
      .string()
      .max(100, "Limite é de 100 caracteres")
      .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/, "É permitido apenas letras, acentos e espaços")
      .optional(),
    celularRepresentante: z.string().max(15, "Limite é de 18 caracteres").optional(),
    telefone: z.string().max(15, "Limite é de 15 caracteres").optional(),
    celular: z.string().min(1, "Obrigatório").max(15, "Limite é de 15 caracteres"),
    email: z.string().min(1, "Obrigatório").max(70, "Limite é de 70 caracteres").email("Email inválido"),
    cep: z.string().min(1, "Obrigatório").max(9, "Limite é de 9 caracteres"),
    logradouro: z.string().min(1, "Obrigatório").max(50, "Limite é de 50 caracteres"),
    numero: z
      .number()
      .max(9999, "Ultrapassou o limite de 9999")
      .refine((e) => e > 0, {
        message: "Obrigatório",
      }),
    complemento: z.string().max(60, "Limite é de 60 caracteres").optional(),
    bairro: z.string().min(1, "Obrigatório").max(60, "Limite é de 60 caracteres"),
    cpfCnpj: z.string(),
    ieRg: z
      .string()
      .regex(/^[0-9]*$/, "Apenas números são permitidos")
      .optional(),
    dtNascimento: z.custom<Date>().optional(),
    ativo: z.boolean(),
    idCidade: z
      .number()
      .refine((value) => value !== 0, "Obrigatório")
      .default(0),
    cidade: z.custom<ICidade>(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    if (data.tpPessoa === "F" && (!data.sexo || (data.sexo !== "F" && data.sexo !== "M"))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["sexo"],
      });
    }

    //Validação de CPF e CNPJ
    if (data.cidade.cidade !== undefined) {
      if (data.cidade.estado.pais.sigla.toUpperCase() === "BR" || data.cpfCnpj.length > 0) {
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
export type ClienteFormData = z.infer<typeof ClienteFormSchema>;

export const defaultValues = {
  id: 0,
  sexo: undefined,
  pessoaRazaoSocial: "",
  apelidoNomeFantasia: "",
  representante: "",
  celularRepresentante: "",
  telefone: "",
  celular: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: 0,
  complemento: "",
  bairro: "",
  cpfCnpj: "",
  ieRg: "",
  idCidade: 0,
  cidade: undefined,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
