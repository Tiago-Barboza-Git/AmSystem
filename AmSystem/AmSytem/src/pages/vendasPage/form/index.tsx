import StepperCustom from "@/components/stepper";
import { H2 } from "@/components/text/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMoney } from "@/functions/functions";
import { IPostVenda, IVenda } from "@/interfaces/Venda/venda.interface";
import { FormProvider, useForm } from "react-hook-form";
import { PostVenda } from "../services/queries";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IProdutoVenda } from "@/interfaces/Venda/produtoVenda.interfaces";
import { VendaFormData, VendaFormSchema, defaultValues } from "./schema";
import { toast } from "sonner";
import DadosNotaPart from "./formParts/dadosNotaPart";
import StepperVendaCustom from "@/components/stepper/stepperVenda";
import ProdutosVendaPart from "./formParts/produtosVenda";
import ContasReceberPart from "./formParts/contasReceberPart";

interface vendaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  venda?: IVenda;
}

const VendaForm = ({ action, isOpen, onOpenChange, venda }: vendaFormProps) => {
  const postCompra = PostVenda(onOpenChange);
  //   const getVerificaExistenciaCompra = GetVerificaExistenciaCompra();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [existCompra, setExistCompra] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);
  const [produtosCompraData, setProdutosCompraData] = useState<IProdutoVenda[]>(venda?.produtos || []);

  const form = useForm<VendaFormData>({
    mode: "onSubmit",
    resolver: zodResolver(VendaFormSchema),
    defaultValues: defaultValues,
  });

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
          "idCliente",
          "cliente.pessoaRazaoSocial",
          "dtEmissao",
        ])) === false
      )
        return;
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
      if (activeStep === 4) {
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
      form.reset({ ...defaultValues });
    } else if (action === "View") {
      form.reset({ ...venda });
      setDisabled(true);
    }
  }, [isOpen]);

  const onSubmit = (data: IPostVenda) => {
    if (activeStep === 4) {
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
        aria-describedby={undefined}
      >
        <DialogTitle className="text-center">
          <span>{venda ? "Visualizar venda" : "Adicionar nova venda"}</span>
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
                venda={venda as IVenda}
                action={action}
                activeStep={activeStep}
              />
            </div>
            <div
              className={`${activeStep === 1 || activeStep == 4 || action === "View" ? "visible" : "hidden"} border-2 border-gray-200 rounded-lg p-5`}
            >
              <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Produtos</H2>
              <ProdutosVendaPart
                disabled={disabled}
                getValue={form.getValues}
                setValue={form.setValue}
                watch={form.watch}
                actionPai={action}
                activedStep={activeStep}
              />
            </div>
            <div
              className={`${activeStep === 3 || activeStep === 4 || action === "View" ? "visible" : "hidden"}  border-2 border-gray-200 rounded-lg p-5`}
            >
              <H2 className={`${action === "View" || activeStep === 4 ? "visible" : "hidden"}`}>Contas à Receber</H2>
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
  );
};

export default VendaForm;
