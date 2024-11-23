import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IPais } from "@/interfaces/pais.interfaces";
import { PaisFormData, PaisFormSchema, defaultValues } from "./schema.tsx";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { formatDate } from "@/functions/functions.tsx";
import { DeletePais, PostPais, PutPais } from "../services/queries.tsx";
import { FileDiff } from "lucide-react";
import FormFieldInput from "@/components/form/input/index.tsx";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import { H3 } from "@/components/typography/index.tsx";

interface paisFormProps {
  action: string;
  setOpen: (open: boolean) => void;
  pais: IPais | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  setPais?: (pais: IPais) => void;
}

const PaisForm = ({ action, setOpen, pais, isOpen, onOpenChange, setPais }: paisFormProps) => {
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);

  const putPais = PutPais(onOpenChange);
  const postPais = PostPais(onOpenChange);
  const form = useForm<PaisFormData>({
    mode: "onChange",
    resolver: zodResolver(PaisFormSchema),
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
        ...pais,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const onSubmit = (data: IPais) => {
    if (action === "Edit") {
      putPais.mutate(data);
    } else {
      postPais.mutate(data);
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
                {action === "Edit" ? "Atualizar o país" : action === "Add" ? "Adicionar novo país" : "Visualizar país"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <FormFieldInput control={form.control} label="Cód." name="id" disabled={true} isNumber={true} />

                  <FormField
                    name="ativo"
                    control={form.control}
                    defaultValue={pais?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setPais ? true : action === "Add" ? true : disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    name="pais"
                    control={form.control}
                    label="País"
                    errorMessage={form.formState.errors.pais?.message}
                    disabled={disabled}
                    maxLength={70}
                    className="col-span-4"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    name="ddi"
                    control={form.control}
                    label="DDI"
                    errorMessage={form.formState.errors.ddi?.message}
                    isNumber={true}
                    disabled={disabled}
                    maxLength={3}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    name="sigla"
                    control={form.control}
                    label="Sigla"
                    errorMessage={form.formState.errors.sigla?.message}
                    disabled={disabled}
                    maxLength={5}
                    className="col-span-2"
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

export default PaisForm;
