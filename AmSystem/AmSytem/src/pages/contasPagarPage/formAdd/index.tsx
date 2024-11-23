import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IContaPagar, IPostContaPagarAvulsa, IPutContaPagar } from "@/interfaces/contasPagar";
import { FormProvider, useForm } from "react-hook-form";
import { ContaPagarFormData, ContaPagarFormSchema, defaultValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldInput from "@/components/form/input";
import SearchItem from "@/components/searchItem";
import InputCalendar from "@/components/form/inputCalendar";
import { useEffect, useState } from "react";
import InputMoney from "@/components/form/inputMoney";
import FormFieldTextArea from "@/components/form/textarea";
import { formatMoney } from "@/functions/functions";
import { PostContaPagarAvulsa, PutContasPagar } from "../services/queries";
import { H1, H2, H3, H4 } from "@/components/typography";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { FornecedoresPage } from "@/pages/fornecedoresPage";
import { FormasPagamentosPage } from "@/pages/formasPagamentosPage";
import { FormItem } from "@/components/ui/form";
import { GetVerificaExistenciaCompra } from "@/pages/comprasPage/services/queries";
import { toast } from "sonner";
import { subMonths } from "date-fns";

interface ContasPagarFormAddProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  contaPagar: IContaPagar | null;
}

function ContaPagarFormAdd({ action, isOpen, onOpenChange, contaPagar }: ContasPagarFormAddProps) {
  const [openFornecedores, setOpenFornecedores] = useState<boolean>(false);
  const [openFormasPagamento, setOpenFormasPagamento] = useState<boolean>(false);

  const [fornecedor, setFornecedor] = useState<IFornecedor | undefined>();
  const [formaPagamento, setFormaPagamento] = useState<IFormaPagamento | undefined>();

  const [disabled, setDisabled] = useState<boolean>(true);
  const [fromDtPagamento, setFromDtPagamento] = useState<boolean>(false);

  const form = useForm<ContaPagarFormData>({
    mode: "onChange",
    resolver: zodResolver(ContaPagarFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "View") {
      setDisabled(true);
      form.reset({ ...contaPagar });
    } else if (action === "Edit") {
      setDisabled(true);
      form.reset({ ...contaPagar });
      form.setValue("dtPagamento", new Date());
    } else if (action === "Add") {
      setDisabled(false);
      form.reset({ ...contaPagar });
    }
  }, [isOpen]);

  useEffect(() => {
    form.setValue("idFornecedor", fornecedor?.id as number);
    form.setValue("fornecedor", fornecedor as IFornecedor);
    setOpenFornecedores(false);
  }, [fornecedor]);

  useEffect(() => {
    form.setValue("idFormaPagamento", formaPagamento?.id as number);
    form.setValue("formaPagamento", formaPagamento as IFormaPagamento);
    setOpenFormasPagamento(false);
  }, [formaPagamento]);

  useEffect(() => {
    form.setValue("desconto", 0);
    form.setValue("juros", 0),
      form.setValue("multa", 0),
      form.setValue("valorPago", Number(formatMoney(form.watch("valorParcela"))));
  }, [form.watch("valorParcela")]);

  useEffect(() => {
    if (action === "Add") {
      form.setValue(
        "valorPago",
        Number(formatMoney(form.watch("valorParcela"))) +
          Number(formatMoney(form.watch("juros"))) +
          Number(formatMoney(form.watch("multa"))) -
          Number(formatMoney(form.watch("desconto"))),
      );
    }
  }, [form.watch("juros"), form.watch("multa")]);

  useEffect(() => {
    if (action === "Add") {
      const valorParcela = isNaN(Number(formatMoney(form.watch("valorParcela"))))
        ? 0
        : Number(formatMoney(form.watch("valorParcela")));

      const juros = isNaN(Number(formatMoney(form.watch("juros")))) ? 0 : Number(formatMoney(form.watch("juros")));

      const multa = isNaN(Number(formatMoney(form.watch("multa")))) ? 0 : Number(formatMoney(form.watch("multa")));

      const desconto = isNaN(Number(formatMoney(form.watch("desconto"))))
        ? 0
        : Number(formatMoney(form.watch("desconto")));

      if (desconto > Number(form.watch("valorPago"))) {
        form.setValue("desconto", 0);
        form.setValue("valorPago", valorParcela + juros + multa);
      } else {
        form.setValue("valorPago", valorParcela + juros + multa - desconto);
      }
    }
  }, [form.watch("desconto")]);

  useEffect(() => {
    if (action === "Add") {
      form.setValue("dtVencimento", new Date());
      form.setValue("dtPagamento", new Date());
    }
  }, [form.watch("dtEmissao")]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Formata a data para 'YYYY-MM-DD'
  };

  const postContaPagarAvulsa = PostContaPagarAvulsa(onOpenChange);

  const verificaDatas = async (): Promise<boolean> => {
    if ((await form.trigger(["dtEmissao", "dtVencimento", "dtPagamento"])) === false) return false;
    else return true;
  };

  const getVerificaExistenciaCompra = GetVerificaExistenciaCompra();

  const onSubmit = async (contaPagar: IPostContaPagarAvulsa) => {
    if ((await form.trigger(["dtEmissao", "dtVencimento", "dtPagamento"])) === true) {
      getVerificaExistenciaCompra.mutate(
        {
          nrNota: form.watch("nrNota"),
          nrModelo: form.watch("nrModelo"),
          nrSerie: form.watch("nrSerie"),
          idFornecedor: form.watch("idFornecedor"),
        },
        {
          onSuccess: (data) => {
            if (data.length === 0) {
              contaPagar.juros = Number(formatMoney(String(contaPagar.juros)));
              contaPagar.desconto = Number(formatMoney(String(contaPagar.desconto)));
              contaPagar.multa = Number(formatMoney(String(contaPagar.multa)));

              const obj: IPostContaPagarAvulsa = contaPagar;
              postContaPagarAvulsa.mutate(obj);
            } else toast.error(data);
          },
          onError: (data: any) => {
            console.log(data);
            toast.error("teste");
          },
        },
      );
    }
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
            <H3 className="text-center">{contaPagar ? "Visualizar conta a pagar" : "Realizar o pagamento"}</H3>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border-2 border-gray-200 rounded-lg p-5">
              <H4 className="text-center mb-5">Informações da Nota</H4>
              <div className="flex flex-row gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Nota*"
                  name="nrNota"
                  control={form.control}
                  isNumber={true}
                  errorMessage={form.formState.errors.nrNota?.message}
                  className="col-span-2"
                />

                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Modelo*"
                  name="nrModelo"
                  control={form.control}
                  isNumber={true}
                  errorMessage={form.formState.errors.nrModelo?.message}
                  className="col-span-2"
                />

                <FormFieldInput
                  trigger={form.trigger}
                  label="Nr. Série*"
                  name="nrSerie"
                  control={form.control}
                  isNumber={true}
                  errorMessage={form.formState.errors.nrSerie?.message}
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
                    obj={fornecedor}
                    setObj={setFornecedor}
                    openSearch={openFornecedores}
                    setOpenSearch={setOpenFornecedores}
                    disabled={disabled}
                    hiddenButton={disabled}
                    errorMessage={form.formState.errors.idFornecedor?.message}
                    page={<FornecedoresPage setFornecedor={setFornecedor} />}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-2 border-gray-200 rounded-lg p-5">
              <H4 className="text-center">Informações da Conta a Pagar</H4>
              <div className="flex flex-row gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Num. Parcela"
                  name="numParcela"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                />
                <InputMoney
                  control={form.control}
                  labelName="Valor Parcela"
                  nameValor="valorParcela"
                  watch={form.watch}
                  disabled={disabled}
                  errorMessage={form.formState.errors.valorParcela?.message}
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
                    obj={formaPagamento}
                    setObj={setFormaPagamento}
                    openSearch={openFormasPagamento}
                    setOpenSearch={setOpenFormasPagamento}
                    disabled={disabled}
                    hiddenButton={disabled}
                    page={<FormasPagamentosPage setFormaPagamento={setFormaPagamento} />}
                    errorMessage={form.formState.errors.idFormaPagamento?.message}
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
                  disabled={
                    action === "Add" ? (Number(formatMoney(form.watch("valorParcela"))) > 0 ? false : true) : disabled
                  }
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="desconto"
                  labelName="Desconto"
                  disabled={
                    action === "Add" ? (Number(formatMoney(form.watch("valorParcela"))) > 0 ? false : true) : disabled
                  }
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="multa"
                  labelName="Multa"
                  disabled={
                    action === "Add" ? (Number(formatMoney(form.watch("valorParcela"))) > 0 ? false : true) : disabled
                  }
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  nameValor="valorPago"
                  labelName="Valor a Pagar"
                  disabled={true}
                />
              </div>
              <div className="flex flex-row gap-4">
                <InputCalendar
                  control={form.control}
                  name="dtEmissao"
                  label="Dt. Emissão"
                  value={form.watch("dtEmissao")}
                  setValue={form.setValue}
                  disabled={disabled}
                  errorMessage={form.formState.errors.dtEmissao?.message}
                  toDate={new Date()}
                  fromDate={subMonths(new Date(), 2)}
                />

                <InputCalendar
                  control={form.control}
                  name="dtVencimento"
                  label="Dt. Vencimento"
                  value={form.watch("dtVencimento")}
                  setValue={form.setValue}
                  disabled={action === "Add" ? (form.watch("dtEmissao") !== undefined ? false : true) : disabled}
                  errorMessage={form.formState.errors.dtVencimento?.message}
                  fromDate={form.watch("dtEmissao")}
                />

                <InputCalendar
                  control={form.control}
                  name="dtPagamento"
                  label="Dt. Pagamento"
                  value={form.watch("dtPagamento")}
                  setValue={form.setValue}
                  disabled={action === "Add" ? (form.watch("dtEmissao") !== undefined ? false : true) : disabled}
                  errorMessage={form.formState.errors.dtPagamento?.message}
                  fromDate={form.watch("dtEmissao")}
                />
              </div>
              <FormFieldTextArea control={form.control} label="Observação" name="observacao" disabled={disabled} />
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
              <Button
                className={`${action === "Add" ? "visible" : "hidden"}`}
                variant="default"
                onClick={() => onSubmit}
              >
                Salvar
              </Button>
              <Button
                className={`${action !== "Add" ? "visible" : "hidden"} bg-green-500`}
                variant="destructive"
                onClick={() => onSubmit}
              >
                Realizar Pagamento
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ContaPagarFormAdd;
