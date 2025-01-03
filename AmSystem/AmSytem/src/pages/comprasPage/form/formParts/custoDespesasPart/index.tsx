import DataTable from "@/components/datatable";
import FormFieldInput from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/text/text.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ICompra } from "@/interfaces/compra.interfaces";
import { ICondicaoPagamento, initialCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { CompraFormData } from "@/pages/comprasPage/form/schema";
import { CondicoesPagamentosPage } from "@/pages/condicoesPagamentosPage";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { getContaPagarPartColumns } from "../contasPagarPart/columns";
import { IContaPagar } from "@/interfaces/contasPagar";
import { watch } from "fs";
import InputMoney from "@/components/form/inputMoney";
import { formatCurrency } from "@/functions/masks";
import { formatMoney } from "@/functions/functions";

interface custosDespesasPartProps {
  control: Control<CompraFormData>;
  setValue: UseFormSetValue<CompraFormData>;
  getValue: UseFormGetValues<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  errors: FieldErrors<CompraFormData>;
  disabled?: boolean;
  compra: ICompra;
  action: string;
}

function CustosDespesasPart({
  control,
  setValue,
  getValue,
  watch,
  errors,
  disabled,
  compra,
  action,
}: custosDespesasPartProps) {
  useEffect(() => {
    if (action !== "View") {
      setValue(
        "totalCusto",
        Number(
          Number(
            Number(formatMoney(watch("seguro"))) +
              Number(formatMoney(watch("outrasDesp"))) +
              Number(formatMoney(watch("frete"))),
          ).toFixed(2),
        ),
      );
      setValue("totalNota", Number(watch("totalCusto")) + Number(watch("totalProdutos")));
      setValue("idCondicaoPagamento", 0);
      setValue("condicaoPagamento", initialCondicaoPagamento);
      setValue("contasPagar", []);
    }
  }, [watch("seguro"), watch("outrasDesp"), watch("frete")]);
  return (
    <div className="grid grid-cols-10 grid-rows-2 gap-4">
      <Controller
        control={control}
        name="tpFrete"
        render={({ field }) => {
          return (
            <div className="col-span-2 row-start-1 row-end-1">
              <Label>Tipo de Frete*:</Label>
              <RadioGroup value={watch("tpFrete")} className="flex flex-row gap-4" disabled={disabled}>
                <div className="flex items-center space-x-2 mt-3">
                  <RadioGroupItem value="CIF" id="r1" onClick={() => setValue("tpFrete", "CIF")} />
                  <span>CIF</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <RadioGroupItem
                    value="FOB"
                    id="r2"
                    onClick={() => {
                      setValue("tpFrete", "FOB");
                      setValue("frete", 0);
                    }}
                  />
                  <span>FOB</span>
                </div>
              </RadioGroup>
            </div>
          );
        }}
      />

      <InputMoney
        control={control}
        watch={watch}
        labelName="Valor Frete"
        nameValor="frete"
        errorMessage={errors.frete?.message}
        disabled={watch("tpFrete") === "FOB" || disabled === true ? true : false}
        className="col-span-2 row-start-2 row-end-2"
      />

      <InputMoney
        control={control}
        watch={watch}
        labelName="Valor Seguro"
        nameValor="seguro"
        errorMessage={errors.seguro?.message}
        disabled={disabled}
        className="col-span-2 row-start-2 row-end-2"
      />

      <InputMoney
        control={control}
        watch={watch}
        labelName="Outras Despesas"
        nameValor="outrasDesp"
        errorMessage={errors.outrasDesp?.message}
        disabled={disabled}
        className="col-span-2 row-start-2 row-end-2"
      />

      <InputMoney
        control={control}
        watch={watch}
        labelName="Total Custo"
        nameValor="totalCusto"
        errorMessage={errors.totalCusto?.message}
        disabled={true}
        className="col-span-2 row-start-2 row-end-2"
      />

      <InputMoney
        control={control}
        watch={watch}
        labelName="Total Compra"
        nameValor="totalNota"
        errorMessage={errors.totalNota?.message}
        disabled={true}
        className="col-span-2 row-start-2 row-end-2"
      />
    </div>
  );
}

export default CustosDespesasPart;
