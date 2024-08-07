import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { CidadeFormData, CidadeFormSchema, defaultValues } from "./schema.tsx";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { formatDate } from "@/functions/functions.tsx";
import { PostCidade, PutCidade } from "../services/queries.tsx";
import { FileDiff, Search } from "lucide-react";
import FormFieldInput from "@/components/form/input/index.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { GetEstados } from "@/pages/estadosPage/services/queries.tsx";
import { IEstado } from "@/interfaces/estado.interfaces.tsx";
import { EstadosPage } from "@/pages/estadosPage/index.tsx";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";

interface cidadeFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  cidade: ICidade | null;
}

const CidadeForm = ({
  action,
  isOpen,
  onOpenChange,
  cidade,
}: cidadeFormProps) => {
  const [openEstados, setOpenEstados] = useState<boolean>(false);
  const [estado, setEstado] = useState<IEstado | undefined>(cidade?.estado);
  const putCidade = PutCidade(onOpenChange);
  const postCidade = PostCidade(onOpenChange);
  const form = useForm<CidadeFormData>({
    mode: "onChange",
    resolver: zodResolver(CidadeFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...cidade,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [cidade, isOpen]);

  useEffect(() => {
    form.setValue("idEstado", estado?.id as number);
    form.setValue("estado", estado as IEstado);
    setOpenEstados(false);
  }, [estado]);

  const onSubmit = (data: ICidade) => {
    if (openEstados === false) {
      if (action === "Edit") {
        putCidade.mutate(data);
      } else {
        postCidade.mutate(data);
      }
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
          <DialogTitle>
            {cidade ? "Atualizar a cidade" : "Adicionar nova cidade"}
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
                  className="col-span-2"
                  errorMessage={form.formState.errors.id?.message}
                  isNumber={true}
                  disabled={true}
                />

                <FormField
                  name="ativo"
                  control={form.control}
                  defaultValue={cidade?.ativo}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 items-center justify-center">
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-8 gap-4">
                <FormFieldInput
                  label="Cidade"
                  name="cidade"
                  control={form.control}
                  errorMessage={form.formState.errors.cidade?.message}
                  className="col-span-4"
                />

                <FormFieldInput
                  label="DDD"
                  name="ddd"
                  control={form.control}
                  errorMessage={form.formState.errors.ddd?.message}
                  isNumber={true}
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-8 gap-4">
                <FormFieldInput
                  label="Cód. Estado"
                  name="idEstado"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Estado"
                  name="estado.estado"
                  control={form.control}
                  disabled={true}
                  className="col-span-4"
                />

                <div className="relative">
                  <Dialog
                    open={openEstados}
                    onOpenChange={(value) => setOpenEstados(value)}
                  >
                    <DialogTrigger asChild className="absolute bottom-0">
                      <Button variant="default">
                        <Search />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="!p-0">
                      <EstadosPage setEstado={setEstado} />
                    </DialogContent>
                  </Dialog>
                </div>
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

export default CidadeForm;
