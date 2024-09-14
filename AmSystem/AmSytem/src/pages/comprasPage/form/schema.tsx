import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar } from "@/interfaces/contasPagar";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { z } from "zod";

export const CompraFormSchema = z
  .object({
    nrNota: z
      .number({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    nrModelo: z
      .number({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    nrSerie: z
      .number({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    idFornecedor: z
      .number({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    fornecedor: z.custom<IFornecedor>(),
    dtEmissao: z.custom<Date>().refine((value) => value !== undefined, "Obrigatório"),
    dtChegada: z.custom<Date>().refine((value) => value !== undefined, "Obrigatório"),
    produtos: z.custom<IProdutoCompra[]>(),
    tpFrete: z.string().optional(),
    frete: z.union([z.string({ message: "Deve conter um valor" }), z.number({ message: "Deve conter um valor" })]),
    seguro: z.union([z.string({ message: "Deve conter um valor" }), z.number({ message: "Deve conter um valor" })]),
    outrasDesp: z.union([z.string({ message: "Deve conter um valor" }), z.number({ message: "Deve conter um valor" })]),
    totalCusto: z.union([z.string(), z.number()]),
    totalProdutos: z.union([z.string(), z.number()]),
    totalCompra: z.union([z.string(), z.number()]),
    contasPagar: z.custom<IContaPagar[]>(),
    observacao: z.string().optional(),
    idCondicaoPagamento: z
      .number()
      .min(0, "Obrigatório")
      .refine((value) => value === 0, "Obrigatório"),
    condicaoPagamento: z.custom<ICondicaoPagamento>(),
    dtCancelamento: z.custom<Date>().optional(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    if (data.idFornecedor === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["fornecedor.pessoaRazaoSocial"],
      });
    }
    if (data.condicaoPagamento === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Obrigatório",
        path: ["condicaoPagamento.condicaoPagamento"],
      });
    }
    if (typeof data.seguro === "string" && data.seguro.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deve conter um valor",
        path: ["seguro"],
      });
    }
  });

export type CompraFormData = z.infer<typeof CompraFormSchema>;

export const defaultValues = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idFornecedor: 0,
  idCondicaoPagamento: 0,
  tpFrete: "FOB",
  frete: "0",
  seguro: "0",
  outrasDesp: "0",
  totalCusto: "0",
  totalProdutos: "0",
  totalCompra: "0",
  produtos: [],
  contasPagar: [],
  // condicaoPagamento: {
  //   id: 0,
  //   condicaoPagamento: "Selecione",
  // },
  // fornecedor: {
  //   id: 0,
  //   pessoaRazaoSocial: "Selecione",
  // },
  dtEmissao: new Date(),
  dtChegada: new Date(),
  dtCadastro: new Date(),
  dtAlteracao: undefined,
};
