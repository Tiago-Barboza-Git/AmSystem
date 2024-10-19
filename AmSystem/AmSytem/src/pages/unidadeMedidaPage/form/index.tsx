import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UnidadeMedidaFormData, UnidadeMedidaFormSchema, defaultValues } from "../schema.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { PostUnidadeMedida, PutUnidadeMedida } from "../services/queries.tsx";
import FormFieldInput from "@/components/form/input/index.tsx";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import FormFieldTextArea from "@/components/form/textarea/index.tsx";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces.tsx";

interface unidadeMedidaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  unidadeMedida: IUnidadeMedida | null;
}

const UnidadeMedidaForm = ({ action, isOpen, onOpenChange, unidadeMedida }: unidadeMedidaFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const putUnidadeMedida = PutUnidadeMedida(onOpenChange);
  const postUnidadeMedida = PostUnidadeMedida(onOpenChange);
  const form = useForm<UnidadeMedidaFormData>({
    mode: "onChange",
    resolver: zodResolver(UnidadeMedidaFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      action === "View" ? setDisabled(true) : setDisabled(false);
      form.reset({
        ...unidadeMedida,
      });
    } else {
      setDisabled(false);
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const onSubmit = (data: IUnidadeMedida) => {
    if (action === "Edit") {
      putUnidadeMedida.mutate(data);
    } else {
      postUnidadeMedida.mutate(data);
    }
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {unidadeMedida ? "Atualizar a unidade de medida" : "Adicionar nova unidade de medida"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
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
                  defaultValue={unidadeMedida?.ativo}
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

              <div className="grid grid-cols-8 gap-4">
                <FormFieldInput
                  label="Unidade de Medida"
                  name="unidadeMedida"
                  control={form.control}
                  disabled={disabled}
                  errorMessage={form.formState.errors.unidadeMedida?.message}
                  className="col-span-4"
                />

                <FormFieldTextArea
                  control={form.control}
                  name="simbolo"
                  label="Símbolo"
                  className="col-span-8"
                  disabled={disabled}
                />
              </div>

              <div className="flex flex-row gap-4">
                <InputCalendar
                  label="Dt. Cadastro"
                  name="dtCadastro"
                  control={form.control}
                  setValue={form.setValue}
                  value={form.watch("dtCadastro")}
                  disabled={true}
                  className="col-span-2 w-50"
                />

                <InputCalendar
                  label="Dt. Alteração"
                  name="dtAlteracao"
                  control={form.control}
                  setValue={form.setValue}
                  value={form.watch("dtAlteracao")}
                  disabled={true}
                  className="col-span-2"
                />
              </div>
              <Button type="submit" variant="default" className={`${action === "View" ? "hidden" : "visible"}`}>
                Salvar
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UnidadeMedidaForm;
