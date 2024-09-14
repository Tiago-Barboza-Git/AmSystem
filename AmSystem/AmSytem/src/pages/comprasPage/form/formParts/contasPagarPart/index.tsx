import DataTable from "@/components/datatable";
import FormFieldInput from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ICompra } from "@/interfaces/compra.interfaces";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IContaPagar } from "@/interfaces/contasPagar";
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
}: ContasPagarPartProps) {
  // Condição Pagamento Begin
  const [openCondicaoPagamento, setOpenCondicaoPagamento] = useState<boolean>(false);
  const [condicaoPagamento, setCondicaoPagamento] = useState<ICondicaoPagamento | undefined>(
    watch("condicaoPagamento"),
  );

  useEffect(() => {
    if (action !== "View" && openCondicaoPagamento !== false) {
      setOpenCondicaoPagamento(false);
      setValue("idCondicaoPagamento", condicaoPagamento?.id as number);
      setValue("condicaoPagamento", condicaoPagamento as ICondicaoPagamento);

      const contasPagar: IContaPagar[] =
        condicaoPagamento?.parcelas.map((parcela, index) => {
          console.log(addDays(watch("dtEmissao") as Date, 30 * (index + 1)));
          return {
            nrNota: watch("nrNota"),
            nrModelo: watch("nrModelo"),
            nrSerie: watch("nrSerie"),
            idFornecedor: watch("idFornecedor"),
            numParcela: index + 1,
            valorParcela:
              (formatMoney(watch("totalProdutos") as string) + formatMoney(watch("totalCusto") as string)) *
              ((parcela.porcentagem as number) / 100),
            dtEmissao: watch("dtEmissao"),
            dtVencimento: addDays(watch("dtEmissao") as Date, 30 * (index + 1)),
            desconto: 0,
            juros: 0,
            multa: 0,
            valorPago: 0,
            valorTotal: 0,
            dtPagamento: undefined,
            idFormaPagamento: parcela.idFormaPagamento ?? 0,
            formaPagamento: parcela.formaPagamento,
            fornecedor: getValue("fornecedor"),
            dtCadastro: new Date(),
            dtAlteracao: new Date(),
          };
        }) || [];

      setValue("contasPagar", contasPagar);
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
