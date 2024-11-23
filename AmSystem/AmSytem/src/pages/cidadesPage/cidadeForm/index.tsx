import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { CidadeFormData, CidadeFormSchema, defaultValues } from "./schema.tsx";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
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
import SearchItem from "@/components/searchItem/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import { H3 } from "@/components/typography/index.tsx";

interface cidadeFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  cidade: ICidade | null;
  setCidade?: (cidade: ICidade) => void;
}

const CidadeForm = ({ action, isOpen, onOpenChange, cidade, setCidade }: cidadeFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openEstados, setOpenEstados] = useState<boolean>(false);
  const [estado, setEstado] = useState<IEstado | undefined>(cidade?.estado);

  const putCidade = PutCidade(onOpenChange);
  const postCidade = PostCidade(onOpenChange);
  const form = useForm<CidadeFormData>({
    mode: "onSubmit",
    resolver: zodResolver(CidadeFormSchema),
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
                  ? "Atualizar a cidade"
                  : action === "Add"
                    ? "Adicionar nova cidade"
                    : "Visualizar cidade"}
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
                    className="w-[5rem]"
                    errorMessage={form.formState.errors.id?.message}
                    isNumber={true}
                    disabled={true}
                  />

                  <FormField
                    name="ativo"
                    control={form.control}
                    defaultValue={cidade?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setCidade ? true : action === "Add" ? true : disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cidade"
                    name="cidade"
                    control={form.control}
                    errorMessage={form.formState.errors.cidade?.message}
                    disabled={disabled}
                    maxLength={70}
                    className="col-span-4"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="DDD"
                    name="ddd"
                    control={form.control}
                    errorMessage={form.formState.errors.ddd?.message}
                    isNumber={true}
                    disabled={disabled}
                    maxLength={4}
                    className="col-span-2"
                  />
                </div>

                <div>
                  <SearchItem
                    control={form.control}
                    getValue={form.getValues}
                    setValue={form.setValue}
                    watch={form.watch}
                    obj={estado}
                    setObj={setEstado}
                    openSearch={openEstados}
                    setOpenSearch={setOpenEstados}
                    labelCod="Cód. Estado"
                    nameCod="idEstado"
                    labelNome="Estado*"
                    nameNome="estado.estado"
                    errorMessage={form.formState.errors?.idEstado?.message}
                    disabled={disabled}
                    page={<EstadosPage setEstado={setEstado} />}
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

export default CidadeForm;
