import { formatMoney } from "@/functions/functions";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar } from "@/interfaces/contasPagar";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { CondicaoPagamentoFormSchema } from "@/pages/condicoesPagamentosPage/form/schema";
import { FornecedorRefFormSchema } from "@/pages/fornecedoresPage/fornecedorForm/schema";
import { z } from "zod";

export const CompraFormSchema = z.object({
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
  dtEmissao: z
    .date({ message: "Obrigatório" })
    .max(new Date(new Date().setHours(0, 0, 0, 0)), "A data de emissão não pode ser no futuro"),
  dtChegada: z.date({ message: "Obrigatório" }),
  produtos: z.custom<IProdutoCompra[]>(),
  tpFrete: z.string(),
  frete: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  seguro: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  outrasDesp: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  totalCusto: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  totalProdutos: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  totalNota: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  contasPagar: z.custom<IPostContaPagar[]>(),
  observacao: z.string().optional(),
  idCondicaoPagamento: z.number({ message: "Obrigatório" }).refine((value) => value > 0, "Obrigatório"),
  condicaoPagamento: z.custom<ICondicaoPagamento>(),
  dtCancelamento: z.custom<Date>().optional(),
  dtCadastro: z.custom<Date>(),
  dtAlteracao: z.custom<Date>(),
});

export type CompraFormData = z.infer<typeof CompraFormSchema>;

export const defaultValues = {
  nrNota: 0,
  nrModelo: 0,
  nrSerie: 0,
  tpFrete: "FOB",
  frete: 0,
  seguro: 0,
  outrasDesp: 0,
  totalCusto: 0,
  totalProdutos: 0,
  totalNota: 0,
  produtos: [],
  contasPagar: [],
  // idCondicaoPagamento: 0,
  // idFornecedor: 0,
  fornecedor: undefined,
  condicaoPagamento: undefined,
  dtEmissao: new Date(new Date().setHours(0, 0, 0, 0)),
  dtChegada: new Date(),
  dtCadastro: new Date(),
  dtAlteracao: undefined,
};
