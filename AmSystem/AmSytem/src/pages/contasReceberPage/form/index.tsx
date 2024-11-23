import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IContaPagar, IPutContaPagar } from "@/interfaces/contasPagar";
import { FormProvider, useForm } from "react-hook-form";
import { ContasReceberFormData, ContasReceberFormSchema, defaultValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldInput from "@/components/form/input";
import SearchItem from "@/components/searchItem";
import InputCalendar from "@/components/form/inputCalendar";
import { useEffect, useState } from "react";
import { H1, H2 } from "@/components/text/text";
import InputMoney from "@/components/form/inputMoney";
import FormFieldTextArea from "@/components/form/textarea";
import { formatMoney } from "@/functions/functions";
import { PutContasReceber } from "../services/queries";
import { IContaReceber, IPutContaReceber } from "@/interfaces/Venda/contasReceber..interfaces";
import { H3, H4 } from "@/components/typography";

interface ContasReceberFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  contaReceber: IContaReceber | null;
}

function ContaReceberForm({ action, isOpen, onOpenChange, contaReceber }: ContasReceberFormProps) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [fromDtPagamento, setFromDtPagamento] = useState<boolean>(false);

  const form = useForm<ContasReceberFormData>({
    mode: "onChange",
    resolver: zodResolver(ContasReceberFormSchema),
    defaultValues: defaultValues,
  });

  console.log(contaReceber);

  useEffect(() => {
    if (action === "View") {
      form.reset({ ...contaReceber });
    } else if (action === "Edit") {
      form.reset({ ...contaReceber });
      if (form.watch("observacao") === null || form.watch("observacao") === undefined) form.setValue("observacao", "");
      form.setValue("dtPagamento", new Date());

      const dtVencimento = new Date(form.watch("dtVencimento")).setHours(0, 0, 0, 0);
      const dtPagamento = new Date(form.watch("dtPagamento")).setHours(0, 0, 0, 0);
      if (dtPagamento <= dtVencimento) {
        form.setValue("multa", 0);
        form.setValue("juros", 0);
        form.setValue(
          "desconto",
          Number(
            (Number(formatMoney(form.watch("condicaoPagamento.desconto"))) / 100) *
              Number(formatMoney(form.watch("valorParcela"))),
          ).toFixed(2) as unknown as number,
        );
        form.setValue(
          "valorPago",
          Number(formatMoney(form.watch("valorParcela"))) - Number(formatMoney(form.watch("desconto"))),
        );
        setFromDtPagamento(true);
      } else {
        const diasAtraso = Math.floor((dtPagamento - dtVencimento) / (1000 * 60 * 60 * 24));
        form.setValue("desconto", 0);
        form.setValue(
          "multa",
          Number(
            (Number(formatMoney(form.watch("valorParcela"))) *
              Number(formatMoney(form.watch("condicaoPagamento.multa")))) /
              100,
          ).toFixed(2) as unknown as number,
        );
        form.setValue(
          "juros",
          Number(
            ((Number(formatMoney(form.watch("valorParcela"))) *
              Number(formatMoney(form.watch("condicaoPagamento.juros")))) /
              100) *
              diasAtraso,
          ).toFixed(2) as unknown as number,
        );
        form.setValue(
          "valorPago",
          Number(formatMoney(form.watch("valorParcela"))) +
            Number(formatMoney(form.watch("multa"))) +
            Number(formatMoney(form.watch("juros"))),
        );
        setFromDtPagamento(true);
      }
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (action === "Edit") {
  //     const dtVencimento = new Date(form.watch("dtVencimento"));
  //     const dtPagamento = new Date(form.watch("dtPagamento"));
  //     if (!isNaN(dtPagamento.getDate())) {
  //       if (dtPagamento <= dtVencimento) {
  //         form.setValue("multa", 0);
  //         form.setValue("juros", 0);
  //         form.setValue(
  //           "desconto",
  //           (Number(formatMoney(form.watch("condicaoPagamento.desconto"))) / 100) *
  //             Number(formatMoney(form.watch("valorParcela"))),
  //         );
  //         form.setValue(
  //           "valorPago",
  //           Number(formatMoney(form.watch("valorParcela"))) - Number(formatMoney(form.watch("desconto"))),
  //         );
  //         setFromDtPagamento(true);
  //       } else {
  //         const diasAtraso = Math.floor((dtPagamento.getTime() - dtVencimento.getTime()) / (1000 * 60 * 60 * 24));
  //         form.setValue("desconto", 0);
  //         form.setValue("multa", Number(formatMoney(form.watch("condicaoPagamento.multa"))));
  //         form.setValue("juros", Number(formatMoney(form.watch("condicaoPagamento.juros"))) * diasAtraso);
  //         form.setValue(
  //           "valorPago",
  //           Number(formatMoney(form.watch("valorParcela"))) +
  //             Number(formatMoney(form.watch("multa"))) +
  //             Number(formatMoney(form.watch("juros"))),
  //         );
  //         setFromDtPagamento(true);
  //       }
  //     }
  //   }
  // }, [form.watch("dtPagamento")]);

  // useEffect(() => {
  //   if (action === "Edit" && fromDtPagamento === false) {
  //     const dtVencimento = new Date(form.watch("dtVencimento"));
  //     const dtPagamento = new Date(form.watch("dtPagamento"));
  //     const diasAtraso = Math.floor((dtPagamento.getTime() - dtVencimento.getTime()) / (1000 * 60 * 60 * 24));

  //     form.setValue(
  //       "valorPago",
  //       (isNaN(Number(formatMoney(String(form.watch("multa")))))
  //         ? 0
  //         : Number(formatMoney(String(form.watch("multa"))))) +
  //         (isNaN(Number(formatMoney(String(form.watch("juros")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("juros"))))) -
  //         (isNaN(Number(formatMoney(String(form.watch("desconto")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("desconto"))))) +
  //         (isNaN(Number(formatMoney(String(form.watch("valorParcela")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("valorParcela"))))),
  //     );
  //   }
  //   setFromDtPagamento(false);
  // }, [form.watch("multa"), form.watch("juros")]);

  // useEffect(() => {
  //   if (action === "Edit" && fromDtPagamento === false) {
  //     form.setValue(
  //       "valorPago",
  //       (isNaN(Number(formatMoney(String(form.watch("multa")))))
  //         ? 0
  //         : Number(formatMoney(String(form.watch("multa"))))) +
  //         (isNaN(Number(formatMoney(String(form.watch("juros")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("juros"))))) -
  //         (isNaN(Number(formatMoney(String(form.watch("desconto")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("desconto"))))) +
  //         (isNaN(Number(formatMoney(String(form.watch("valorParcela")))))
  //           ? 0
  //           : Number(formatMoney(String(form.watch("valorParcela"))))),
  //     );
  //   }
  // }, [form.watch("desconto")]);

  const putContaReceber = PutContasReceber(onOpenChange);

  const onSubmit = (data: IContaReceber) => {
    data.juros = Number(formatMoney(String(data.juros)));
    data.desconto = Number(formatMoney(String(data.desconto)));
    data.multa = Number(formatMoney(String(data.multa)));
    const obj: IPutContaReceber = data;
    putContaReceber.mutate(obj);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen-lg max-h-[80%] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <H3 className="text-center">{action === "Edit" ? "Receber conta" : "Visualizar conta à receber"}</H3>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border-2 border-gray-200 rounded-lg p-5 flex flex-col gap-4">
              <H4 className="text-center">Informações da Nota de Venda</H4>
              <div className="flex flex-row gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Nota*"
                  name="nrNota"
                  control={form.control}
                  isNumber={true}
                  disabled={disabled}
                  className="col-span-2"
                />

                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Modelo*"
                  name="nrModelo"
                  control={form.control}
                  disabled={disabled}
                  isNumber={true}
                  className="col-span-2"
                />

                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Série*"
                  name="nrSerie"
                  control={form.control}
                  isNumber={true}
                  disabled={disabled}
                  className="col-span-2"
                />

                <div className="col-span-6">
                  <SearchItem
                    control={form.control}
                    getValue={form.getValues}
                    setValue={form.setValue}
                    watch={form.watch}
                    labelCod="Cód. Cliente"
                    nameCod="idCliente"
                    labelNome="Cliente*"
                    nameNome="cliente.pessoaRazaoSocial"
                    disabled={disabled}
                    hiddenButton={true}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-2 border-gray-200 rounded-lg p-5">
              <H4 className="text-center">Informações da conta à receber</H4>
              <div className="flex flex-row gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Num. Parcela"
                  name="numParcela"
                  control={form.control}
                  isNumber={true}
                  disabled={disabled}
                />
                <InputMoney
                  control={form.control}
                  labelName="Valor Parcela"
                  nameValor="valorParcela"
                  watch={form.watch}
                  disabled={true}
                />
                <div className="col-span-6">
                  <SearchItem
                    control={form.control}
                    getValue={form.getValues}
                    setValue={form.setValue}
                    watch={form.watch}
                    labelCod="Cód. Forma Pag."
                    nameCod="idFormaPagamento"
                    labelNome="Forma Pagamento"
                    nameNome="formaPagamento.formaPagamento"
                    disabled={disabled}
                    hiddenButton={true}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="juros"
                  labelName="Juros"
                  disabled={true}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="desconto"
                  labelName="Desconto"
                  disabled={true}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="multa"
                  labelName="Multa"
                  disabled={true}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="valorPago"
                  labelName="Valor a Pagar"
                  disabled={true}
                  className={`${action === "Edit" ? "text-orange-500" : "text-black"} `}
                />
              </div>
              <div className="flex flex-row gap-4">
                <InputCalendar
                  control={form.control}
                  name="dtEmissao"
                  label="Dt. Emissão"
                  value={form.watch("dtEmissao")}
                  disabled={true}
                />

                <InputCalendar
                  control={form.control}
                  name="dtVencimento"
                  label="Dt. Vencimento"
                  value={form.watch("dtVencimento")}
                  disabled={true}
                />

                <InputCalendar
                  control={form.control}
                  name="dtPagamento"
                  label="Dt. Pagamento"
                  value={form.watch("dtPagamento")}
                  setValue={form.setValue}
                  disabled={true}
                />
              </div>
              <FormFieldTextArea
                control={form.control}
                label="Observação"
                name="observacao"
                disabled={action === "Edit" ? false : true}
                maxLength={50}
              />
              <div className="flex flex-row gap-4">
                <InputCalendar
                  control={form.control}
                  name="dtCadastro"
                  label="Dt. Cadastro"
                  value={form.watch("dtCadastro")}
                  disabled={true}
                />

                <InputCalendar
                  control={form.control}
                  name="dtAlteracao"
                  label="Dt. Alteração"
                  value={form.watch("dtAlteracao")}
                  disabled={true}
                />
              </div>
            </div>
            <div className={`${action === "View" ? "hidden" : "visible"}`}>
              <Button variant="secondary" onClick={() => onsubmit} className="bg-green-500">
                Realizar Pagamento
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ContaReceberForm;
