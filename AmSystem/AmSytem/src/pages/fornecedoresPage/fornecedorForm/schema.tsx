import { formatDate } from "@/functions/functions";
import { validarCPF, validarCNPJ } from "@/functions/validates";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { z } from "zod";

export const FornecedorFormSchema = z
  .object({
    id: z.number(),
    tpFornecedor: z.string(),
    fornecedorRazaoSocial: z
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
    sexo: z.string().optional(),
    representante: z
      .string()
      .regex(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]*$/,
        "É permitido apenas letras, acentos e espaços"
      )
      .optional(),

    celularRepresentante: z.string().optional(),
    telefone: z.string().optional(),
    celular: z.string().min(1, "Obrigatório"),
    email: z.string().min(1, "Obrigatório").email("Email inválido"),
    cep: z.string().min(1, "Obrigatório"),
    endereco: z.string().min(1, "Obrigatório"),
    numero: z.number().refine((e) => e > 0, {
      message: "Obrigatório",
    }),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "Obrigatório"),
    cpfCnpj: z.string().min(1, "Obrigatório"),
    ieRg: z.string().optional(),
    dtNascimento: z.custom<Date>(),
    ativo: z.boolean(),
    idCidade: z
      .number({ message: "Obrigatório" })
      .refine((value) => value !== 0, {
        message: "Selecione uma cidade",
      }),
    cidade: z.custom<ICidade>(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    //Sexo obrigatório, caso o tipo de cliente seja pessoa física
    if (
      data.tpFornecedor === "F" &&
      (!data.sexo || (data.sexo !== "F" && data.sexo !== "M"))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["sexo"],
      });
    }

    //Validação de CPF e CNPJ
    if (data.tpFornecedor === "F") {
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
export type FornecedorFormData = z.infer<typeof FornecedorFormSchema>;

export const defaultValues = {
  id: 0,
  ativo: true,
  numero: 0,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
