import { formatDate, formatMoney } from "@/functions/functions";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IEstado } from "@/interfaces/estado.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProduto } from "@/interfaces/produto.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { ProdutoFormSchema } from "@/pages/produtosPage/produtoForm/schema";
import { z } from "zod";

export const ProdutoVendaFormSchema = z.object({
  quantidade: z.number().refine((value) => value > 0, "Insira a quantidade"),
  precoUnit: z
    .preprocess((val) => Number(formatMoney(String(val))), z.number())
    .refine((value) => value !== 0, "Deve ser maior que 0"),
  precoTotal: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
  idProduto: z.number().min(1, "Obrigatório"),
  produto: z.custom<IProduto>(),
});

export type ProdutoVendaFormData = z.infer<typeof ProdutoVendaFormSchema>;

export const defaultValues = {
  quantidade: 0,
  precoUnit: 0,
  precoTotal: 0,
  idProduto: 0,
};
