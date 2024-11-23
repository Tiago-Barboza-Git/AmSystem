import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IContaPagar, IPutContaPagar } from "@/interfaces/contasPagar";
import { FormProvider, useForm } from "react-hook-form";
import { ContaPagarFormData, ContaPagarFormSchema, defaultValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldInput from "@/components/form/input";
import SearchItem from "@/components/searchItem";
import InputCalendar from "@/components/form/inputCalendar";
import { useEffect, useState } from "react";
import { H1, H2 } from "@/components/text/text";
import InputMoney from "@/components/form/inputMoney";
import FormFieldTextArea from "@/components/form/textarea";
import { formatMoney } from "@/functions/functions";
import { PutContasPagar } from "../services/queries";
import { H3, H4 } from "@/components/typography";

interface ContasPagarFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  contaPagar: IContaPagar | null;
}

function ContaPagarForm({ action, isOpen, onOpenChange, contaPagar }: ContasPagarFormProps) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [fromDtPagamento, setFromDtPagamento] = useState<boolean>(false);

  const form = useForm<ContaPagarFormData>({
    mode: "onChange",
    resolver: zodResolver(ContaPagarFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "View") {
      console.log(contaPagar);
      form.reset({ ...contaPagar });
    } else if (action === "Edit") {
      form.reset({ ...contaPagar });
      form.setValue("dtPagamento", new Date());
      form.setValue("dtPagamento", new Date());

      const dtVencimento = new Date(form.watch("dtVencimento"));
      const dtPagamento = new Date(form.watch("dtPagamento"));
      if (dtPagamento.setHours(0, 0, 0, 0) <= dtVencimento.setHours(0, 0, 0, 0)) {
        form.setValue("multa", 0);
        form.setValue("juros", 0);
        form.setValue(
          "desconto",
          (Number(formatMoney(form.watch("condicaoPagamento.desconto"))) / 100) *
            Number(formatMoney(form.watch("valorParcela"))),
        );
        form.setValue(
          "valorPago",
          Number(formatMoney(form.watch("valorParcela"))) - Number(formatMoney(form.watch("desconto"))),
        );
        setFromDtPagamento(true);
      } else {
        const diasAtraso = Math.floor((dtPagamento.getTime() - dtVencimento.getTime()) / (1000 * 60 * 60 * 24));
        form.setValue("desconto", 0);
        form.setValue(
          "multa",
          (Number(formatMoney(form.watch("valorParcela"))) *
            Number(formatMoney(form.watch("condicaoPagamento.multa")))) /
            100,
        );
        form.setValue(
          "juros",
          ((Number(formatMoney(form.watch("valorParcela"))) *
            Number(formatMoney(form.watch("condicaoPagamento.juros")))) /
            100) *
            diasAtraso,
        );
        form.setValue(
          "valorPago",
          Number(formatMoney(form.watch("valorParcela"))) +
            Number(formatMoney(form.watch("multa"))) +
            Number(formatMoney(form.watch("juros"))),
        );
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
  //         form.setValue("desconto", Number(formatMoney(form.watch("condicaoPagamento.desconto"))));
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

  const putContaPagar = PutContasPagar(onOpenChange);

  const onSubmit = (data: IContaPagar) => {
    data.juros = Number(formatMoney(String(data.juros)));
    data.desconto = Number(formatMoney(String(data.desconto)));
    data.multa = Number(formatMoney(String(data.multa)));
    const obj: IPutContaPagar = data;
    putContaPagar.mutate(obj);
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
            <H3>{contaPagar ? "Visualizar conta a pagar" : "Realizar o pagamento"}</H3>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border-2 border-gray-200 rounded-lg p-5">
              <H4>Informações da Nota de Compra</H4>
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
                    labelCod="Cód. Fornecedor"
                    nameCod="idFornecedor"
                    labelNome="Fornecedor*"
                    nameNome="fornecedor.pessoaRazaoSocial"
                    disabled={disabled}
                    hiddenButton={true}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-2 border-gray-200 rounded-lg p-5">
              <H4>Informações da Conta a Pagar</H4>
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
                  disabled={disabled}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="desconto"
                  labelName="Desconto"
                  disabled={disabled}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="multa"
                  labelName="Multa"
                  disabled={disabled}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="valorPago"
                  labelName="Valor a Pagar"
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-row gap-4">
                <InputCalendar
                  control={form.control}
                  name="dtEmissao"
                  label="Dt. Emissão"
                  value={form.watch("dtEmissao")}
                  disabled={disabled}
                />

                <InputCalendar
                  control={form.control}
                  name="dtVencimento"
                  label="Dt. Vencimento"
                  value={form.watch("dtVencimento")}
                  disabled={disabled}
                />

                <InputCalendar
                  control={form.control}
                  name="dtPagamento"
                  label="Dt. Pagamento"
                  value={form.watch("dtPagamento")}
                  setValue={form.setValue}
                  disabled={disabled}
                />

                {/* <InputCalendar
                  control={form.control}
                  name="dtCancelamento"
                  label="Dt. Cancelamento"
                  value={form.watch("dtPagamento")}
                  disabled={true}
                  className={`${form.watch("cancelada") ? "visible" : "hidden"} text-red-500`}
                /> */}
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
                  disabled={disabled}
                />

                <InputCalendar
                  control={form.control}
                  name="dtAlteracao"
                  label="Dt. Alteração"
                  value={form.watch("dtAlteracao")}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className={`${action === "View" ? "hidden" : "visible"}`}>
              <Button variant="default" onClick={() => onsubmit}>
                Realizar Pagamento
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ContaPagarForm;
