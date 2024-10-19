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

interface paisFormProps {
  action: string;
  setOpen: (open: boolean) => void;
  pais: IPais | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

const PaisForm = ({ action, setOpen, pais, isOpen, onOpenChange }: paisFormProps) => {
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);
  const putPais = PutPais(onOpenChange);
  const postPais = PostPais(onOpenChange);
  const form = useForm<PaisFormData>({
    mode: "onChange",
    resolver: zodResolver(PaisFormSchema),
    defaultValues: defaultValues,
  });

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!min-w-max overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{pais ? "Atualizar o país" : "Adicionar novo país"}</DialogTitle>
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
                  name="pais"
                  control={form.control}
                  label="País"
                  errorMessage={form.formState.errors.pais?.message}
                  disabled={disabled}
                  className="col-span-3"
                />

                <FormFieldInput
                  name="ddi"
                  control={form.control}
                  label="DDI"
                  errorMessage={form.formState.errors.ddi?.message}
                  isNumber={true}
                  disabled={disabled}
                  className="col-span-2"
                />

                <FormFieldInput
                  name="sigla"
                  control={form.control}
                  label="Sigla"
                  errorMessage={form.formState.errors.sigla?.message}
                  disabled={disabled}
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
                  disabled={disabled}
                  className="col-span-2 w-50"
                />

                <InputCalendar
                  label="Dt. Alteração"
                  name="dtAlteracao"
                  control={form.control}
                  setValue={form.setValue}
                  value={form.watch("dtAlteracao")}
                  disabled={disabled}
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

export default PaisForm;
