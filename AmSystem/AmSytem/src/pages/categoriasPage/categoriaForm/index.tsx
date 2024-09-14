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

interface categoriaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  categoria: ICategoria | null;
}

const CategoriaForm = ({ action, isOpen, onOpenChange, categoria }: categoriaFormProps) => {
  const putCategoria = PutCategoria(onOpenChange);
  const postCategoria = PostCategoria(onOpenChange);
  const form = useForm<CategoriaFormData>({
    mode: "onChange",
    resolver: zodResolver(CategoriaFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{categoria ? "Atualizar a categoria" : "Adicionar nova categoria"}</DialogTitle>
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
                  defaultValue={categoria?.ativo}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 items-center justify-center">
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch defaultChecked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-8 gap-4">
                <FormFieldInput
                  label="Categoria"
                  name="categoria"
                  control={form.control}
                  errorMessage={form.formState.errors.categoria?.message}
                  className="col-span-4"
                />

                <FormFieldTextArea control={form.control} name="descricao" label="Descrição" className="col-span-8" />

                {/* <FormFieldInput
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

export default CategoriaForm;
