import DataTable from "@/components/datatable";
import FormFieldInput from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ICompra } from "@/interfaces/compra.interfaces";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar, IPostContaPagar } from "@/interfaces/contasPagar";
import { CompraFormData } from "@/pages/comprasPage/form/schema";
import { CondicoesPagamentosPage } from "@/pages/condicoesPagamentosPage";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Control, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { getContaPagarPartColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import SearchItem from "@/components/searchItem";
import { H3 } from "@/components/text/text";
import { formatMoney } from "@/functions/functions";

interface ContasPagarPartProps {
  control: Control<CompraFormData>;
  setValue: UseFormSetValue<CompraFormData>;
  getValue: UseFormGetValues<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  errors: FieldErrors<CompraFormData>;
  compra: ICompra;
  action?: string;
  disabled?: boolean;
  activeStep: number;
}

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function ContasPagarPart({
  control,
  setValue,
  getValue,
  watch,
  errors,
  compra,
  action,
  disabled,
  activeStep,
}: ContasPagarPartProps) {
  // Condição Pagamento Begin
  const [openCondicaoPagamento, setOpenCondicaoPagamento] = useState<boolean>(false);
  const [condicaoPagamento, setCondicaoPagamento] = useState<ICondicaoPagamento | undefined>(
    watch("condicaoPagamento"),
  );

  useEffect(() => {
    if (action !== "View") {
      if (openCondicaoPagamento !== false) {
        setOpenCondicaoPagamento(false);
        setValue("idCondicaoPagamento", condicaoPagamento?.id as number);
        setValue("condicaoPagamento", condicaoPagamento as ICondicaoPagamento);

        // Total de produtos + custos
        const totalProdutosCusto = Number(formatMoney(watch("totalProdutos")) + formatMoney(watch("totalCusto")));

        let somaParcelas = 0;
        const contasPagar: IPostContaPagar[] =
          condicaoPagamento?.parcelas.map((parcela, index, arr) => {
            let valorParcela = 0;

            if (index === condicaoPagamento?.parcelas.length - 1) {
              // Última parcela: subtrair a soma das parcelas anteriores para garantir o valor restante
              valorParcela = totalProdutosCusto - somaParcelas;
            } else {
              // Parcelas intermediárias: calcular normalmente
              valorParcela = Number(Number(totalProdutosCusto * ((parcela.porcentagem as number) / 100)).toFixed(2));
              somaParcelas += valorParcela; // Acumula o valor para as próximas parcelas
            }

            return {
              idFormaPagamento: parcela.idFormaPagamento,
              numParcela: index + 1,
              valorParcela: Number(formatMoney(valorParcela).toFixed(2)),
              dtVencimento: addDays(watch("dtEmissao") as Date, parcela.dias),
              formaPagamento: parcela.formaPagamento,
            };
          }) || [];

        setValue("contasPagar", contasPagar);
      }
    }
  }, [condicaoPagamento]);

  // Condição Pagamento End

  return (
    <div>
      <SearchItem
        control={control}
        getValue={getValue}
        setValue={setValue}
        watch={watch}
        obj={condicaoPagamento}
        setObj={setCondicaoPagamento}
        openSearch={openCondicaoPagamento}
        setOpenSearch={setOpenCondicaoPagamento}
        disabled={disabled}
        errorMessage={errors?.idCondicaoPagamento?.message}
        labelCod="Cód. Cond. Pag."
        labelNome="Condição Pagamento"
        nameCod="idCondicaoPagamento"
        nameNome="condicaoPagamento.condicaoPagamento"
        page={<CondicoesPagamentosPage setCondicaoPagamento={setCondicaoPagamento} />}
        hiddenButton={action === "View" || activeStep === 4 ? true : false}
      />
      <Separator className="!mt-10 !mb-9" />
      <div>
        <H3>Parcelas</H3>
        <DataTable
          columns={useMemo(() => getContaPagarPartColumns({}), [])}
          data={watch("contasPagar")}
          hidden={true}
        />
      </div>
    </div>
  );
}

export default ContasPagarPart;
