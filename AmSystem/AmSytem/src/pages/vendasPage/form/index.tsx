import StepperCustom from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMoney } from "@/functions/functions";
import { IPostVenda, IVenda } from "@/interfaces/Venda/venda.interface";
import { FormProvider, useForm } from "react-hook-form";
import { PostVenda, VerificaVenda } from "../services/queries";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IProdutoVenda } from "@/interfaces/Venda/produtoVenda.interfaces";
import { VendaFormData, VendaFormSchema, defaultValues } from "./schema";
import { toast } from "sonner";
import DadosNotaPart from "./formParts/dadosNotaPart";
import StepperVendaCustom from "@/components/stepper/stepperVenda";
import ProdutosVendaPart from "./formParts/produtosVenda";
import ContasReceberPart from "./formParts/contasReceberPart";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { GetVerificaExistenciaCompra } from "@/pages/comprasPage/services/queries";
import { formatWithOptions } from "util";
import { Title } from "@radix-ui/react-dialog";
import { H1, H2, H3 } from "@/components/typography";

interface vendaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  venda?: IVenda;
  nextIdent?: number;
}

const VendaForm = ({ action, isOpen, onOpenChange, venda, nextIdent }: vendaFormProps) => {
  const verificaVenda = VerificaVenda();
  const postVenda = PostVenda(onOpenChange);
  //   const getVerificaExistenciaCompra = GetVerificaExistenciaCompra();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [existVenda, setExistVenda] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);
  const [produtosVendaData, setProdutosVendaData] = useState<IProdutoVenda[]>(venda?.produtos || []);

  const form = useForm<VendaFormData>({
    mode: "onSubmit",
    resolver: zodResolver(VendaFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
    "formVendas",
  );

  useEffect(() => {
    form.setValue("produtos", produtosVendaData);
  }, [produtosVendaData]);

  const handleNexstStep = async () => {
    if (activeStep === 0) {
      if (
        (await form.trigger([
          "nrNota",
          "nrModelo",
          "nrSerie",
          "idCliente",
          "cliente.pessoaRazaoSocial",
          "dtEmissao",
        ])) === false
      )
        return;
      else {
        verificaVenda.mutate(
          {
            nrNota: form.watch("nrNota"),
            nrModelo: form.watch("nrModelo"),
            nrSerie: form.watch("nrSerie"),
            idCliente: form.watch("idCliente"),
          },
          {
            onSuccess: (data) => {
              if (!data) setActiveStep(activeStep + 1);
              else toast.error("Já existe uma venda registrada com esses dados!");
            },
          },
        );
      }
    } else if (activeStep === 1) {
      if (form.watch("produtos") !== undefined && form.watch("produtos").length > 0) {
        const totalProdutos = form
          .getValues("produtos")
          .reduce((sum, item) => (sum + formatMoney(String(item.precoTotal))) as number, 0);

        form.setValue("totalProdutos", totalProdutos);
        form.clearErrors("condicaoPagamento");
        form.clearErrors("idCondicaoPagamento");
        setActiveStep(activeStep + 1);
      } else {
        toast.error("É necessário que a venda tenha ao menos um produto!!!");
      }
    } else if (activeStep === 2) {
      if ((await form.trigger(["idCondicaoPagamento", "condicaoPagamento.condicaoPagamento"])) === false) return;
      if (form.watch("idCondicaoPagamento") !== 0) {
        setDisabled(true);
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleLastStep = () => {
    if (activeStep !== 0) {
      if (activeStep === 3) {
        setDisabled(false);
      }
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...venda,
      });
    } else if (action === "Add") {
      setActiveStep(0);
      setDisabled(false);
      form.reset({
        ...defaultValues,
        nrNota: nextIdent,
      });
    } else if (action === "View") {
      form.reset({ ...venda });
      setDisabled(true);
    }
  }, [isOpen]);

  const onSubmit = (data: IPostVenda) => {
    if (activeStep === 3) {
      postVenda.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-lg max-h-[80%] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          aria-describedby={undefined}
        >
          <DialogTitle className="text-center">
            <H2>{action === "View" ? "Visualizar venda" : "Adicionar nova venda"}</H2>
          </DialogTitle>
          <DialogHeader className={`${action === "View" ? "hidden" : "visible"}`}>
            <StepperVendaCustom
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              permissionNext={true}
              labels={["Dados da Nota", "Registro dos Produtos", "Contas a Receber", "Visualizar Venda"]}
            />
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div
                className={`${activeStep === 0 || activeStep == 3 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
              >
                <H3 className={`${action === "View" || activeStep === 3 ? "visible" : "hidden"} text-center`}>
                  Dados da Nota
                </H3>
                <DadosNotaPart
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  getValue={form.getValues}
                  watch={form.watch}
                  disabled={disabled}
                  venda={venda as IVenda}
                  action={action}
                  activeStep={activeStep}
                />
              </div>
              <div
                className={`${activeStep === 1 || activeStep == 3 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
              >
                <H3 className={`${action === "View" || activeStep === 3 ? "visible" : "hidden"} text-center`}>
                  Produtos
                </H3>
                <ProdutosVendaPart
                  disabled={disabled}
                  getValue={form.getValues}
                  setValue={form.setValue}
                  control={form.control}
                  watch={form.watch}
                  actionPai={action}
                  activedStep={activeStep}
                />
              </div>
              <div
                className={`${activeStep === 2 || activeStep === 3 || action === "View" ? "visible" : "hidden"}  border-2 border-gray-200 rounded-lg p-5`}
              >
                <H3 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"} text-center`}>
                  Contas à Receber
                </H3>
                <ContasReceberPart
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  getValue={form.getValues}
                  watch={form.watch}
                  action={action}
                  disabled={disabled}
                  venda={venda as IVenda}
                  activeStep={activeStep}
                />
              </div>
              <div className="flex flex-row gap-4 justify-end">
                <Button
                  className={`${activeStep === 0 || action === "View" ? "hidden" : "visible"} w-40`}
                  variant="secondary"
                  onClick={handleLastStep}
                >
                  <span>Anterior</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNexstStep}
                  className={`${activeStep === 3 || action === "View" ? "hidden" : "visible"} w-40`}
                >
                  <span>Próximo</span>
                </Button>
                <Button className={`${activeStep === 3 && action !== "View" ? "visible" : "hidden"}`} type="submit">
                  <span>Salvar</span>
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default VendaForm;
