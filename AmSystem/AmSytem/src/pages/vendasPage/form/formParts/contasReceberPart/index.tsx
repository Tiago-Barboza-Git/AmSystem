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
import { getContaReceberPartColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import SearchItem from "@/components/searchItem";
import { H3 } from "@/components/text/text";
import { formatMoney } from "@/functions/functions";
import { IPostContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";
import { VendaFormData } from "../../schema";
import { IVenda } from "@/interfaces/Venda/venda.interface";
import { H4 } from "@/components/typography";
import { IParcela } from "@/interfaces/parcela.interfaces";

interface ContasReceberPartProps {
  control: Control<VendaFormData>;
  setValue: UseFormSetValue<VendaFormData>;
  getValue: UseFormGetValues<VendaFormData>;
  watch: UseFormWatch<VendaFormData>;
  errors: FieldErrors<VendaFormData>;
  venda: IVenda;
  action?: string;
  disabled?: boolean;
  activeStep: number;
}

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function ContasReceberPart({
  control,
  setValue,
  getValue,
  watch,
  errors,
  venda,
  action,
  disabled,
  activeStep,
}: ContasReceberPartProps) {
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
        const totalProdutos = Number(formatMoney(watch("totalProdutos")));

        let somaParcelas = 0;
        const contasReceber: IPostContaReceber[] =
          condicaoPagamento?.parcelas.map((parcela: IParcela, index, arr) => {
            let valorParcela = 0;

            if (index === condicaoPagamento?.parcelas.length - 1) {
              // Última parcela: subtrair a soma das parcelas anteriores para garantir o valor restante
              valorParcela = totalProdutos - somaParcelas;
            } else {
              // Parcelas intermediárias: calcular normalmente
              valorParcela = Number(Number(totalProdutos * ((parcela.porcentagem as number) / 100)).toFixed(2));
              somaParcelas += valorParcela; // Acumula o valor para as próximas parcelas
            }

            return {
              idFormaPagamento: parcela.idFormaPagamento,
              numParcela: index + 1,
              valorParcela: formatMoney(valorParcela).toFixed(2),
              dtVencimento: parcela.dias === 0 ? watch("dtEmissao") : addDays(watch("dtEmissao") as Date, parcela.dias),
              formaPagamento: parcela.formaPagamento,
            };
          }) || [];

        setValue("contasReceber", contasReceber);
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
        hiddenButton={action === "View" || activeStep === 3 ? true : false}
      />
      <Separator className="!mt-10 !mb-9" />
      <div>
        <H4 className="text-center">Parcelas</H4>
        <DataTable
          columns={useMemo(() => getContaReceberPartColumns({}), [])}
          data={watch("contasReceber")}
          hidden={true}
        />
      </div>
    </div>
  );
}

export default ContasReceberPart;
