import { formatDate, formatMoney } from "@/functions/functions";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IEstado } from "@/interfaces/estado.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProduto } from "@/interfaces/produto.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { ProdutoFormSchema } from "@/pages/produtosPage/produtoForm/schema";
import { z } from "zod";

export const ProdutoCompraFormSchema = z.object({
  // nrNota: z.number(),
  // nrModelo: z.number(),
  // nrSerie: z.number(),
  // idFornecedor: z.number(),
  // fornecedor: z.custom<IFornecedor>(),
  quantidade: z.number().refine((value) => value > 0, "Insira a quantidade"),
  precoUnit: z
    .preprocess((val) => Number(formatMoney(String(val))), z.number())
    .refine((value) => value !== 0, "Deve ser maior que 0"),
  precoTotal: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  custoProd: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  custoUnit: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  rateio: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  idProduto: z.number().min(1, "Obrigatório"),
  produto: z.custom<IProduto>(),
});

export type ProdutoCompraFormData = z.infer<typeof ProdutoCompraFormSchema>;

export const defaultValues = {
  quantidade: 0,
  precoUnit: 0,
  precoTotal: 0,
  custoProd: 0,
  custoUnit: 0,
  rateio: 0,
  idProduto: 0,
};
