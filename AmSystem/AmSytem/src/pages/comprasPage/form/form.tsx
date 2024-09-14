import FormFieldInput from "@/components/form/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICompra } from "@/interfaces/compra.interfaces";
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
    mode: "onTouched",
    resolver: zodResolver(CompraFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.setValue("produtos", produtosCompraData);
  }, [produtosCompraData]);

  const handleNexstStep = async () => {
    if (activeStep === 0) {
      if ((await form.trigger(["nrNota", "nrModelo", "nrSerie", "idFornecedor", "dtEmissao", "dtChegada"])) === false)
        toast.error("Os campos apresetandos possuem erros.");
      else {
        getVerificaExistenciaCompra.mutate(
          {
            nrNota: form.watch("nrNota"),
            nrModelo: form.watch("nrModelo"),
            nrSerie: form.watch("nrSerie"),
            idFornecedor: form.watch("idFornecedor"),
          },
          {
            onSuccess: (data) => {
              if (!data) setActiveStep(activeStep + 1);
              else toast.error("Já existe uma compra registrada com esses dados!");
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
            .reduce((sum, item) => (sum + formatMoney(item.precoTotal as string)) as number, 0) as number,
        );
        setActiveStep(activeStep + 1);
      } else {
        toast.error("É necessário que a compra tenha ao menos um produto!!!");
      }
    } else if (activeStep === 2) {
      // form.clearErrors(["condicaoPagamento.condicaoPagamento", "idCondicaoPagamento"]);
      setActiveStep(activeStep + 1);
    } else if (activeStep === 3) {
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
      form.reset(defaultValues);
    } else if (action === "View") {
      form.reset({ ...compra });
      setDisabled(true);
    }
  }, [action]);

  const onSubmit = (data: ICompra) => {
    if (activeStep === 4) {
      data.outrasDesp = formatCurrency(data.outrasDesp as string);
      data.seguro = formatCurrency(data.seguro as string);
      postCompra.mutate(data);
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
        <DialogTitle className="text-center">
          <H1>{compra ? "Visualizar compra" : "Adicionar nova compra"}</H1>
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
              />
            </div>
            <div className="flex flex-row justify-end gap-4 !mt-5">
              <Button
                className={`${activeStep === 4 && action !== "View" ? "visible" : "hidden"}`}
                type="button"
                onClick={() => onSubmit}
              >
                <span>Salvar</span>
              </Button>
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
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CompraForm;
