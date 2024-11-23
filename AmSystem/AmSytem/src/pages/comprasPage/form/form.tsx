import FormFieldInput from "@/components/form/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICompra, IPostCompra } from "@/interfaces/compra.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CompraFormData, CompraFormSchema, defaultValues } from "./schema";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import StepperCustom from "@/components/stepper";
import { GetVerificaExistenciaCompra, PostCompra } from "../services/queries";
import { toast } from "sonner";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import ContasPagarPart from "./formParts/contasPagarPart";
import { formatCurrency } from "@/functions/masks";
import DadosNotaPart from "./formParts/dadosNotaPart/form";
import CustosDespesasPart from "./formParts/custoDespesasPart";
import ProdutosCompraPart from "./formParts/produtosCompraPart/form";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatMoney } from "@/functions/functions";
import { unknown } from "zod";
import { H1, H2 } from "@/components/text/text";
import { isError, useMutation, useQuery } from "react-query";
import { isEqual } from "date-fns";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { H3 } from "@/components/typography";
// import { lastStep, nextStep } from "./verifySteps";

interface comprasFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  compra?: ICompra;
}

export const CompraForm = ({ action, isOpen, onOpenChange, compra }: comprasFormProps) => {
  const postCompra = PostCompra(onOpenChange);
  const getVerificaExistenciaCompra = GetVerificaExistenciaCompra();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [existCompra, setExistCompra] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);
  const [produtosCompraData, setProdutosCompraData] = useState<IProdutoCompra[]>(compra?.produtos || []);

  const form = useForm<CompraFormData>({
    mode: "onSubmit",
    resolver: zodResolver(CompraFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
    "Compra",
  );

  useEffect(() => {
    form.setValue("produtos", produtosCompraData);
  }, [produtosCompraData]);

  const handleNexstStep = async () => {
    if (activeStep === 0) {
      if (
        (await form.trigger([
          "nrNota",
          "nrModelo",
          "nrSerie",
          "idFornecedor",
          "fornecedor.pessoaRazaoSocial",
          "dtEmissao",
        ])) === false
      )
        return;
      else if (
        new Date(form.watch("dtChegada")).setHours(0, 0, 0, 0) < new Date(form.watch("dtEmissao")).setHours(0, 0, 0, 0)
      ) {
        form.setError("dtChegada", { message: "Deve ser maior ou igual a Dt. Emissão" });
      } else {
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
                setActiveStep(activeStep + 1);
              } else toast.error(data);
            },
          },
        );
      }
    } else if (activeStep === 1) {
      if (form.watch("produtos") !== undefined && form.watch("produtos").length > 0) {
        form.setValue(
          "totalProdutos",
          form
            .getValues("produtos")
            .reduce((sum, item) => (sum + formatMoney(String(item.precoTotal))) as number, 0) as number,
        );
        form.clearErrors("condicaoPagamento");
        form.clearErrors("idCondicaoPagamento");
        setActiveStep(activeStep + 1);
      } else if (form.watch("produtos").reduce((sum, item) => sum + Number(item.precoTotal), 0) === 0) {
        toast.error("Os produtos não podem ter valor 0!!!");
      } else {
        toast.error("É necessário que a compra tenha ao menos um produto!!!");
      }
    } else if (activeStep === 2) {
      setActiveStep(activeStep + 1);
    } else if (activeStep === 3) {
      if ((await form.trigger(["idCondicaoPagamento", "condicaoPagamento.condicaoPagamento"])) === false) return;

      if (form.watch("idCondicaoPagamento") !== 0) {
        setDisabled(true);
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleLastStep = () => {
    if (activeStep !== 0) {
      if (activeStep === 4) {
        setDisabled(false);
      }

      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...compra,
      });
    } else if (action === "Add") {
      setActiveStep(0);
      setDisabled(false);
      form.reset({ ...defaultValues });
    } else if (action === "View") {
      form.reset({ ...compra });
      setDisabled(true);
    }
  }, [isOpen]);

  const onSubmit = (data: IPostCompra) => {
    if (activeStep === 4) {
      data.outrasDesp = formatMoney(data.outrasDesp);
      data.seguro = formatMoney(data.seguro);
      data.frete = formatMoney(data.frete);
      postCompra.mutate(data);
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
            <H3>
              {action === "Add" ? "Adicionar nova compra" : action === "View" ? "Visualizar compra" : "Pagar compra"}
            </H3>
          </DialogTitle>
          <DialogHeader className={`${action === "View" ? "hidden" : "visible"}`}>
            <StepperCustom
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              permissionNext={true}
              labels={[
                "Dados da Nota",
                "Registro dos Produtos",
                "Custos e Despesas",
                "Contas a Pagar",
                "Visualizar Compra",
              ]}
            />
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div
                className={`${activeStep === 0 || activeStep == 4 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
              >
                <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Dados da Nota</H2>
                <DadosNotaPart
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  getValue={form.getValues}
                  watch={form.watch}
                  disabled={disabled}
                  compra={compra as ICompra}
                  action={action}
                  activeStep={activeStep}
                  trigger={form.trigger}
                />
              </div>
              <div
                className={`${activeStep === 1 || activeStep == 4 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
              >
                <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Produtos</H2>
                <ProdutosCompraPart
                  disabled={disabled}
                  getValue={form.getValues}
                  setValue={form.setValue}
                  watch={form.watch}
                  actionPai={action}
                  activedStep={activeStep}
                />
              </div>
              <div
                className={`${activeStep === 2 || activeStep === 4 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
              >
                <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Custos e Despesas</H2>
                <CustosDespesasPart
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  getValue={form.getValues}
                  watch={form.watch}
                  disabled={disabled}
                  compra={compra as ICompra}
                  action={action}
                />
              </div>
              <div
                className={`${activeStep === 3 || activeStep === 4 || action === "View" ? "visible" : "hidden"}  border-2 border-gray-200 rounded-lg p-5`}
              >
                <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Contas à Pagar</H2>
                <ContasPagarPart
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  getValue={form.getValues}
                  watch={form.watch}
                  action={action}
                  disabled={disabled}
                  compra={compra as ICompra}
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
                  className={`${activeStep === 4 || action === "View" ? "hidden" : "visible"} w-40`}
                >
                  <span>Próximo</span>
                </Button>
                <Button className={`${activeStep === 4 && action !== "View" ? "visible" : "hidden"}`} type="submit">
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

export default CompraForm;
