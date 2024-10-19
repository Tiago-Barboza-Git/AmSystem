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

interface formaPagamentoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  formaPagamento: IFormaPagamento | null;
}

const FormaPagamentoForm = ({ action, isOpen, onOpenChange, formaPagamento }: formaPagamentoFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const putFormaPagamento = PutFormaPagamento(onOpenChange);
  const postFormaPagamento = PostFormaPagamento(onOpenChange);
  const form = useForm<FormaPagamentoFormData>({
    mode: "onChange",
    resolver: zodResolver(FormaPagamentoFormSchema),
    defaultValues: defaultValues,
  });

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen-md max-h-[80%] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {formaPagamento ? "Atualizar a forma de pagamento" : "Adicionar nova forma de pagamento"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between col-span-9">
                <FormFieldInput
                  label="Cód."
                  name="id"
                  control={form.control}
                  errorMessage={form.formState.errors.id?.message}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2"
                />

                <FormField
                  name="ativo"
                  control={form.control}
                  defaultValue={formaPagamento?.ativo}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 items-center justify-center">
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch defaultChecked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormFieldInput
                label="Forma de Pagamento"
                name="formaPagamento"
                control={form.control}
                disabled={disabled}
                errorMessage={form.formState.errors.formaPagamento?.message}
                className="col-span-4"
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
              <Button type="submit" variant="default">
                Salvar
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default FormaPagamentoForm;
