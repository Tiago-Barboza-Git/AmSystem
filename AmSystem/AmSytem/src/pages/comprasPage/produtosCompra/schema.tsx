import { formatDate } from "@/functions/functions";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IEstado } from "@/interfaces/estado.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IProduto } from "@/interfaces/produto.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { z } from "zod";

export const ProdutoCompraFormSchema = z
  .object({
    nrNota: z.number().optional(),
    nrModelo: z.number().optional(),
    nrSerie: z.number().optional(),
    idFornecedor: z.number().optional(),
    fornecedor: z.custom<IFornecedor>().optional(),
    quantidade: z
      .number()
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    precoUnit: z.union([z.string(), z.number()]),
    precoTotal: z.union([z.string(), z.number()]),
    custoProd: z.union([z.string(), z.number()]),
    custoUnit: z.union([z.string(), z.number()]),
    rateio: z.union([z.string(), z.number()]),
    idProduto: z
      .number()
      .min(1, "Obrigatório")
      .refine((value) => value > 0, "Obrigatório"),
    produto: z.custom<IProduto>(),
  })
  .superRefine((data, ctx) => {});

export type ProdutoCompraFormData = z.infer<typeof ProdutoCompraFormSchema>;

export const defaultValues = {
  quantidade: 0,
  precoUnit: 0,
  precoTotal: 0,
  custoProd: 0,
  custoUnit: 0,
  rateio: 0,
  idProduto: 0,
  dtCadastro: new Date(),
};
