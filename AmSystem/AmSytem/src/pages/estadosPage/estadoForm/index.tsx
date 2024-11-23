import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IEstado } from "@/interfaces/estado.interfaces";
import { EstadoFormData, EstadoFormSchema, defaultValues } from "./schema.tsx";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
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
import SearchItem from "@/components/searchItem/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import { H3 } from "@/components/typography/index.tsx";

interface estadoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  estado: IEstado | null;
  setEstado?: (estado: IEstado) => void;
}

const EstadoForm = ({ action, isOpen, onOpenChange, estado, setEstado }: estadoFormProps) => {
  const [disabled, setDisabled] = useState<boolean>(action === "View" ? true : false);
  const [openPaises, setOpenPaises] = useState<boolean>(false);
  const [pais, setPais] = useState<IPais | undefined>();

  const putEstado = PutEstado(onOpenChange);
  const postEstado = PostEstado(onOpenChange);
  const form = useForm<EstadoFormData>({
    mode: "onChange",
    resolver: zodResolver(EstadoFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
  );

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      if (action === "View") setDisabled(true);
      else {
        setDisabled(false);
      }
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
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="!max-w-screen-sm max-h-[80%] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar o estado"
                  : action === "Add"
                    ? "Adicionar novo estado"
                    : "Visualizar estado"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-row justify-between">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Cód."
                  name="id"
                  control={form.control}
                  className="w-[5rem]"
                  errorMessage={form.formState.errors.id?.message}
                  isNumber={true}
                  disabled={true}
                />

                <FormField
                  name="ativo"
                  control={form.control}
                  defaultValue={estado?.ativo}
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                    >
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={setEstado ? true : action === "Add" ? true : disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-8 gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Estado"
                  name="estado"
                  control={form.control}
                  disabled={disabled}
                  errorMessage={form.formState.errors.estado?.message}
                  maxLength={50}
                  className="col-span-4"
                />

                <FormFieldInput
                  trigger={form.trigger}
                  label="UF"
                  name="uf"
                  control={form.control}
                  className="col-span-2"
                  disabled={disabled}
                  maxLength={5}
                  errorMessage={form.formState.errors.uf?.message}
                />
              </div>

              <div>
                <SearchItem
                  control={form.control}
                  getValue={form.getValues}
                  setValue={form.setValue}
                  watch={form.watch}
                  obj={pais}
                  setObj={setPais}
                  openSearch={openPaises}
                  setOpenSearch={setOpenPaises}
                  labelCod="Cód. País"
                  nameCod="idPais"
                  labelNome="País*"
                  nameNome="pais.pais"
                  errorMessage={form.formState.errors?.idPais?.message}
                  disabled={disabled}
                  page={<PaisesPage setPais={setPais} />}
                  hiddenButton={action === "View" || disabled === true ? true : false}
                  className="flex flex-row gap-4 flex-grow"
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
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default EstadoForm;
