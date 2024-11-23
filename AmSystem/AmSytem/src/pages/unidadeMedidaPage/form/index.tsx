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
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import { H3 } from "@/components/typography/index.tsx";

interface unidadeMedidaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  unidadeMedida: IUnidadeMedida | null;
  setUnidadeMedida?: (unidadeMedida: IUnidadeMedida | undefined) => void;
}

const UnidadeMedidaForm = ({
  action,
  isOpen,
  onOpenChange,
  unidadeMedida,
  setUnidadeMedida,
}: unidadeMedidaFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();

  const putUnidadeMedida = PutUnidadeMedida(onOpenChange);
  const postUnidadeMedida = PostUnidadeMedida(onOpenChange);
  const form = useForm<UnidadeMedidaFormData>({
    mode: "onChange",
    resolver: zodResolver(UnidadeMedidaFormSchema),
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
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-md"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar a unidade de medida"
                  : action === "Add"
                    ? "Adicionar nova unidade de medida"
                    : "Visualizar unidade de medida"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
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
                    defaultValue={unidadeMedida?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setUnidadeMedida ? true : disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Unidade de Medida"
                    name="unidadeMedida"
                    control={form.control}
                    disabled={disabled}
                    errorMessage={form.formState.errors.unidadeMedida?.message}
                    className="col-span-3"
                    maxLength={50}
                  />

                  <FormFieldInput
                    control={form.control}
                    name="simbolo"
                    label="Conversão"
                    className="col-span-1"
                    disabled={disabled}
                    maxLength={4}
                    errorMessage={form.formState.errors.simbolo?.message}
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

export default UnidadeMedidaForm;
