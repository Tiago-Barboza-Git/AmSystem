import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormaPagamentoFormData, FormaPagamentoFormSchema, defaultValues } from "./schema";
import { useEffect, useState } from "react";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { PostFormaPagamento, PutFormaPagamento } from "../services/queries";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Parcelas } from "@/pages/parcelas";
import { IParcela } from "@/interfaces/parcela.interfaces";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { H2, H3 } from "@/components/typography";

interface formaPagamentoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  formaPagamento: IFormaPagamento | null;
  setFormaPagamento?: (formaPagamento: IFormaPagamento) => void;
}

const FormaPagamentoForm = ({
  action,
  isOpen,
  onOpenChange,
  formaPagamento,
  setFormaPagamento,
}: formaPagamentoFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const putFormaPagamento = PutFormaPagamento(onOpenChange);
  const postFormaPagamento = PostFormaPagamento(onOpenChange);
  const form = useForm<FormaPagamentoFormData>({
    mode: "onChange",
    resolver: zodResolver(FormaPagamentoFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
  );

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      action === "View" ? setDisabled(true) : setDisabled(false);
      form.reset({
        ...formaPagamento,
      });
    } else {
      setDisabled(false);
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const onSubmit = (data: IFormaPagamento) => {
    if (action === "Edit") {
      putFormaPagamento.mutate(data);
    } else {
      postFormaPagamento.mutate(data);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-sm max-h-[80%] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar a forma de pagamento"
                  : action === "Add"
                    ? "Adicionar nova forma de pagamento"
                    : "Visualizar forma de pagamento"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between col-span-9">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cód."
                    name="id"
                    control={form.control}
                    errorMessage={form.formState.errors.id?.message}
                    isNumber={true}
                    disabled={true}
                    className="w-[5rem]"
                  />

                  <FormField
                    name="ativo"
                    control={form.control}
                    defaultValue={formaPagamento?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setFormaPagamento ? true : disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormFieldInput
                  trigger={form.trigger}
                  label="Forma de Pagamento"
                  name="formaPagamento"
                  control={form.control}
                  disabled={disabled}
                  errorMessage={form.formState.errors.formaPagamento?.message}
                  className="w-[25rem]"
                  maxLength={50}
                />
                <Separator className="!mt-10 !mb-9" />
                <div className="flex flex-row gap-4 !m-0">
                  <InputCalendar
                    label="Dt. Cadastro"
                    name="dtCadastro"
                    control={form.control}
                    setValue={form.setValue}
                    value={form.watch("dtCadastro")}
                    disabled={true}
                    className="flex flex-col"
                  />

                  <InputCalendar
                    label="Dt. Alteração"
                    name="dtAlteracao"
                    control={form.control}
                    setValue={form.setValue}
                    value={form.watch("dtAlteracao")}
                    disabled={true}
                    className="flex flex-col"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="destructive"
                    className={`${action === "View" ? "hidden" : "visible"}  w-[10rem]`}
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className={`${action === "View" ? "hidden" : "visible"} bg-[#4A90E2] w-[10rem] hover:bg-[#2b5c95]`}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default FormaPagamentoForm;
