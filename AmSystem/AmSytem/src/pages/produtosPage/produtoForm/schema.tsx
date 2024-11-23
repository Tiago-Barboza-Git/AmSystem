import { formatDate, formatMoney } from "@/functions/functions";
import { ICategoria } from "@/interfaces/categoria.interfaces";
import { IEstado } from "@/interfaces/estado.interfaces";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces";
import { z } from "zod";

export const ProdutoFormSchema = z
  .object({
    id: z.number(),
    produto: z.string({ message: "Obrigatório" }),
    // .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/, "É permitido apenas letras, acentos e espaços"),
    quantidade: z.number(),
    precoVenda: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    precoUltCompra: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    dtUltCompra: z.custom<Date>().optional(),
    custoMedio: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    custoUnitUltCompra: z.preprocess((val) => Number(formatMoney(String(val))), z.number()),
    desconto: z
      .preprocess((val) => Number(formatMoney(String(val))), z.number())
      .refine((value) => !Number.isNaN(value), "Deve ser 0 ou maior"),
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
  custoUnitUltCompra: 0,
  desconto: 0,
  observacao: "",
  ativo: true,
  dtCadastro: new Date(),
  dtAlteracao: new Date(),
};
