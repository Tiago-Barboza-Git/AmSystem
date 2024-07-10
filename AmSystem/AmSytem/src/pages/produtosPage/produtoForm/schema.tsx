import { formatDate } from "@/functions/functions";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IEstado } from "@/interfaces/estado.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { z } from "zod";

export const ProdutoFormSchema = z
  .object({
    id: z.number(),
    produto: z
      .string()
      .min(1, "Esse campo é obrigatório")
      .regex(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
        "É permitido apenas letras, acentos e espaços"
      ),
    quantidade: z.number().optional(),
    precoVenda: z.union([z.string(), z.number()]).optional(),
    precoUltCompra: z.union([z.string(), z.number()]).optional(),
    dtUltCompra: z.custom<Date>().optional(),
    custoMedio: z.union([z.string(), z.number()]).optional(),
    observacao: z.string().optional(),
    idUnidadeMedida: z.number(),
    idCategoria: z.number(),
    idFornecedor: z.number().optional(),
    unidadeMedida: z.custom<IUnidadeMedida>(),
    categoria: z.custom<ICategoria>(),
    fornecedor: z.custom<IFornecedor>().optional(),
    ativo: z.boolean(),
    dtCadastro: z.custom<Date>(),
    dtAlteracao: z.custom<Date>(),
  })
  .superRefine((data, ctx) => {});

export type ProdutoFormData = z.infer<typeof ProdutoFormSchema>;

export const defaultValues = {
  id: 0,
  quantidade: 0,
  precoVenda: 0,
  precoUltCompra: 0,
  custoMedio: 0,
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
