import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IEstado } from "@/interfaces/estado.interfaces";
import { EstadoFormData, EstadoFormSchema, defaultValues } from "./schema.tsx";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { formatDate } from "@/functions/functions.tsx";
import { PostEstado, PutEstado } from "../services/queries.tsx";
import { Search } from "lucide-react";
import FormFieldInput from "@/components/form/input/index.tsx";
import { GetPaises } from "@/pages/paisesPage/services/queries.tsx";
import { PaisesPage } from "@/pages/paisesPage/index.tsx";
import { IPais } from "@/interfaces/pais.interfaces.tsx";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import { Label } from "@/components/ui/label.tsx";

interface estadoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  estado: IEstado | null;
}

const EstadoForm = ({
  action,
  isOpen,
  onOpenChange,
  estado,
}: estadoFormProps) => {
  const [openPaises, setOpenPaises] = useState<boolean>(false);
  const [pais, setPais] = useState<IPais | undefined>();
  const putEstado = PutEstado(onOpenChange);
  const postEstado = PostEstado(onOpenChange);
  const form = useForm<EstadoFormData>({
    mode: "onChange",
    resolver: zodResolver(EstadoFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...estado,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  useEffect(() => {
    form.setValue("idPais", pais?.id as number);
    form.setValue("pais", pais as IPais);
    setOpenPaises(false);
  }, [pais]);

  const onSubmit = (data: IEstado) => {
    if (openPaises === false) {
      if (action === "Edit") {
        putEstado.mutate(data);
      } else {
        postEstado.mutate(data);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {estado ? "Atualizar o estado" : "Adicionar novo estado"}
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
                    defaultValue={estado?.ativo}
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
                    label="Estado"
                    name="estado"
                    control={form.control}
                    className="col-span-4"
                    errorMessage={form.formState.errors.estado?.message}
                  />

                  <FormFieldInput
                    label="UF"
                    name="uf"
                    control={form.control}
                    className="col-span-2"
                    errorMessage={form.formState.errors.uf?.message}
                  />
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <FormFieldInput
                    label="Cód. País"
                    name="idPais"
                    control={form.control}
                    isNumber={true}
                    disabled={true}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    label="País"
                    name="pais.pais"
                    control={form.control}
                    disabled={true}
                    className="col-span-4"
                  />

                  <div className="flex flex-col gap-8">
                    <Label></Label>
                    <Dialog
                      open={openPaises}
                      onOpenChange={(value) => setOpenPaises(value)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="default" size={"default"}>
                          <Search size={"lg"} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="!p-0">
                        <PaisesPage setPais={setPais} />
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
                    className="col-span-2"
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
    </>
  );
};

export default EstadoForm;
