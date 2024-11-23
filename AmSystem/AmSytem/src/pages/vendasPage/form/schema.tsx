import { formatMoney } from "@/functions/functions";
import { IPostContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";
import { IProdutoVenda } from "@/interfaces/Venda/produtoVenda.interfaces";
import { IClienteRef, iCliente } from "@/interfaces/cliente.interfaces";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar } from "@/interfaces/contasPagar";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { CondicaoPagamentoFormSchema } from "@/pages/condicoesPagamentosPage/form/schema";
import { FornecedorRefFormSchema } from "@/pages/fornecedoresPage/fornecedorForm/schema";
import { z } from "zod";

export const VendaFormSchema = z
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
    idCliente: z
      .number({ message: "Obrigatório" })
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    cliente: z.custom<iCliente>(),
    dtEmissao: z
      .date({ message: "Obrigatório" })
      .max(new Date(new Date().setHours(0, 0, 0, 0)), "A data de emissão não pode ser no futuro"),
    produtos: z.custom<IProdutoVenda[]>(),
    totalProdutos: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    totalNota: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    contasReceber: z.custom<IPostContaReceber[]>(),
    observacao: z.string().optional(),
    idCondicaoPagamento: z.number({ message: "Obrigatório" }).refine((value) => value > 0, "Obrigatório"),
    condicaoPagamento: z.custom<ICondicaoPagamento>(),
    dtCancelamento: z.custom<Date>().optional(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {
    // if (data.desconto > data.totalProdutos) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Desconto não pode ser maior!",
    //     path: ["desconto"],
    //   });
    // }
  });

export type VendaFormData = z.infer<typeof VendaFormSchema>;

export const defaultValues = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  idCliente: 0,
  idCondicaoPagamento: 0,
  totalProdutos: 0,
  totalNota: 0,
  produtos: [],
  contasReceber: [],
  dtEmissao: new Date(new Date().setHours(0, 0, 0, 0)),
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
