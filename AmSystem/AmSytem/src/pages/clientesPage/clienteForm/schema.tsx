import { formatDate } from "@/functions/functions";
import { validarCPF, validarCNPJ } from "@/functions/validates";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const ClienteFormSchema = z
  .object({
    id: z.number(),
    tpCliente: z.string(),
    clienteRazaoSocial: z
      .string({ message: "Esse campo é obrigatório" })
      .nonempty("Esse campo é obrigatório")
      .regex(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
        "É permitido apenas letras, acentos e espaços"
      ),
    apelidoNomeFantasia: z
      .string()
      .regex(
        /^([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*)$/,
        "É permitido apenas letras, acentos e espaços"
      )
      .optional(),
    sexo: z.string({ message: "Esse campo é obrigatório" }).optional(),
    representante: z
      .string()
      .regex(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/,
        "É permitido apenas letras, acentos e espaços"
      )
      .optional(),

    celularRepresentante: z.string().optional(),
    telefone: z.string().optional(),
    celular: z
      .string({ message: "Esse campo é obrigatório" })
      .min(1, "Esse campo é obrigatório"),
    email: z
      .string({ message: "Esse campo é obrigatório" })
      .min(0, "Esse campo é obrigatório")
      .email("Email inválido"),
    cep: z.string({ message: "Esse campo é obrigatório" }).nonempty(),
    endereco: z.string({ message: "Esse campo é obrigatório" }).nonempty(),
    numero: z
      .number()
      .refine((e) => e > 0, {
        message: "Insira um número",
      })
      .refine((e) => typeof e === "number", {
        message: "Esse campo só aceita números",
      }),
    complemento: z.string().optional(),
    bairro: z.string({ message: "Esse campo é obrigatório" }).min(1),
    cpfCnpj: z
      .string({ message: "Esse campo é obrigatório" })
      .min(1, "Esse campo é obrigatório"),
    // .refine((value) => validarCPF(value) === true, {
    //   message: "CPF inválido",
    // }),

    ieRg: z.string().optional(),
    dtNascimento: z.custom<Date>().optional(),
    ativo: z.boolean(),
    idCidade: z
      .number({ message: "Esse campo é obrigatório" })
      .refine((value) => value !== 0, {
        message: "Selecione uma cidade",
      }),
    cidade: z.custom<ICidade>(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    if (
      data.tpCliente === "F" &&
      (!data.sexo || (data.sexo !== "F" && data.sexo !== "M"))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sexo é obrigatório",
        path: ["sexo"],
      });
    }

    //Validação de CPF e CNPJ
    if (data.tpCliente === "F") {
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
  });
export type ClienteFormData = z.infer<typeof ClienteFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  numero: 0,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
