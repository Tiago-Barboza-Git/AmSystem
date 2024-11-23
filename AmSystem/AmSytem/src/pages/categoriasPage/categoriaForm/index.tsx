import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoriaFormData, CategoriaFormSchema, defaultValues } from "./schema.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { PostCategoria, PutCategoria } from "../services/queries.tsx";
import FormFieldInput from "@/components/form/input/index.tsx";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import { ICategoria } from "@/interfaces/categoria.interfaces.tsx";
import FormFieldTextArea from "@/components/form/textarea/index.tsx";
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import { H3 } from "@/components/typography/index.tsx";

interface categoriaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  categoria: ICategoria | null;
  setCategoria?: (categoria: ICategoria) => void;
}

const CategoriaForm = ({ action, isOpen, onOpenChange, categoria, setCategoria }: categoriaFormProps) => {
  const putCategoria = PutCategoria(onOpenChange);
  const postCategoria = PostCategoria(onOpenChange);
  const form = useForm<CategoriaFormData>({
    mode: "onChange",
    resolver: zodResolver(CategoriaFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
  );

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      form.reset({
        ...categoria,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const onSubmit = (data: ICategoria) => {
    if (action === "Edit") {
      putCategoria.mutate(data);
    } else {
      postCategoria.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="!max-w-screen-md"
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar a categoria"
                  : action === "Add"
                    ? "Adicionar nova categoria"
                    : "Visualizar categoria"}
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
                    defaultValue={categoria?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setCategoria || action !== "Edit" ? true : false}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Categoria"
                    name="categoria"
                    control={form.control}
                    errorMessage={form.formState.errors.categoria?.message}
                    className="col-span-4"
                    maxLength={50}
                  />

                  <FormFieldTextArea
                    control={form.control}
                    name="descricao"
                    label="Descrição"
                    className="col-span-8"
                    maxLength={40}
                  />

                  {/* <FormFieldInput trigger={form.trigger}
                  label="Descrição"
                  name="descricao"
                  control={form.control}
                  errorMessage={form.formState.errors.descricao?.message}
                  className="col-span-8"
                /> */}
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

export default CategoriaForm;
