import { zodResolver } from "@hookform/resolvers/zod";
import { PostFuncionario, PutFuncionario } from "../services/queries";
import { FuncionarioFormData, FuncionarioFormSchema, defaultValues } from "./schema";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { removeSpecialCharacters } from "@/functions/functions";
import { formatPISPASEP, insertMaskCEP, insertMaskCPF, insertMaskCel } from "@/functions/masks";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormFieldInput from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { IFuncionario } from "@/interfaces/funcionario.interfaces";
import { CidadesPage } from "@/pages/cidadesPage";
import { Search } from "lucide-react";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import InputCalendar from "@/components/form/inputCalendar";
import InputMoney from "@/components/form/inputMoney";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { subYears } from "date-fns";
import { H3, H4 } from "@/components/typography";

interface funcionarioFormProps {
  action: string;
  isOpen: boolean;
  funcionario: IFuncionario | null;
  onOpenChange: (value: boolean) => void;
}

const FuncionarioForm = ({ action, isOpen, funcionario, onOpenChange }: funcionarioFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openCidades, setOpenCidades] = useState<boolean>(false);
  const [cidade, setCidade] = useState<ICidade | undefined>();

  const putFuncionario = PutFuncionario(onOpenChange);
  const postFuncionario = PostFuncionario(onOpenChange);
  const form = useForm<FuncionarioFormData>({
    mode: "onSubmit",
    resolver: zodResolver(FuncionarioFormSchema),
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
        ...funcionario,
      });
    } else {
      setDisabled(false);
      form.reset(defaultValues);
    }
  }, [funcionario, isOpen]);

  useEffect(() => {
    if (cidade !== undefined) {
      form.setValue("idCidade", cidade?.id as number);
      form.setValue("cidade", cidade as ICidade);
      setOpenCidades(false);
    }
  }, [cidade]);

  const onSubmit = (data: IFuncionario) => {
    if (openCidades === false) {
      data.pis = removeSpecialCharacters(data?.pis);
      data.cpf = removeSpecialCharacters(data.cpf);
      data.celular = removeSpecialCharacters(data.celular);
      data.rg = removeSpecialCharacters(data.rg as string);
      data.cep = removeSpecialCharacters(data.cep as string);

      if (action === "Edit") putFuncionario.mutate(data);
      else postFuncionario.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-lg max-h-[80%] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar o funcionário"
                  : action === "Add"
                    ? "Adicionar novo funcionário"
                    : "Visualizar funcionário"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
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
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch defaultChecked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="border-2 p-5 flex flex-col gap-4">
                <H4 className="text-center">Dados Pessoais</H4>
                <div className="grid grid-cols-9 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    errorMessage={form.formState.errors.funcionario?.message}
                    label="Funcionário*"
                    name="funcionario"
                    control={form.control}
                    disabled={disabled}
                    maxLength={100}
                    className="col-span-4"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Apelido"
                    name="apelido"
                    control={form.control}
                    disabled={disabled}
                    maxLength={100}
                    errorMessage={form.formState.errors.apelido?.message}
                    className="col-span-3"
                  />

                  <FormField
                    name="sexo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className={`col-span-2 `}>
                        <FormLabel>Sexo*</FormLabel>
                        <FormControl {...field}>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={disabled}
                          >
                            <SelectTrigger className="">
                              <SelectValue>
                                {form.watch("sexo") !== undefined
                                  ? form.watch("sexo") === "F"
                                    ? "Feminino"
                                    : "Masculino"
                                  : "Selecione um sexo"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sexos</SelectLabel>
                                <SelectItem value="F">Feminino</SelectItem>
                                <SelectItem value="M">Masculino</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormLabel className="text-xs">{form.formState.errors.sexo?.message}</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Telefone"
                    name="telefone"
                    control={form.control}
                    maskFunction={insertMaskCel}
                    disabled={disabled}
                    maxLength={15}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Celular*"
                    name="celular"
                    control={form.control}
                    errorMessage={form.formState.errors.celular?.message}
                    maskFunction={insertMaskCel}
                    disabled={disabled}
                    maxLength={15}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Email*"
                    name="email"
                    control={form.control}
                    disabled={disabled}
                    className="col-span-4"
                    maxLength={70}
                    errorMessage={form.formState.errors.email?.message}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="CPF*"
                    name="cpf"
                    control={form.control}
                    errorMessage={form.formState.errors.cpf?.message}
                    maskFunction={insertMaskCPF}
                    disabled={action === "Edit" ? true : disabled}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="RG"
                    name="rg"
                    control={form.control}
                    errorMessage={form.formState.errors.rg?.message}
                    disabled={disabled}
                    maxLength={14}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="PIS"
                    name="pis"
                    control={form.control}
                    maskFunction={formatPISPASEP}
                    disabled={disabled}
                    className="col-span-2"
                  />

                  <div className="flex flex-col gap-[1.12rem] col-span-2">
                    <InputCalendar
                      name="dtNascimento"
                      label="Dt. Nascimento"
                      setValue={form.setValue}
                      value={form.watch("dtNascimento")}
                      control={form.control}
                      fromDate={new Date(1910, 1, 1)}
                      toDate={subYears(new Date(), 18)}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
              <Separator className="!mt-10 !mb-9" />
              <div className="border-2 p-5 flex flex-col gap-4">
                <H4 className="text-center">Endereço</H4>
                <div className="grid grid-cols-9 grid-rows-3 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="CEP*"
                    name="cep"
                    control={form.control}
                    className="col-span-3"
                    errorMessage={form.formState.errors.cep?.message}
                    maskFunction={insertMaskCEP}
                    disabled={disabled}
                    maxLength={9}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Rua*"
                    name="logradouro"
                    control={form.control}
                    className="col-span-3"
                    errorMessage={form.formState.errors.logradouro?.message}
                    disabled={disabled}
                    maxLength={50}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Número*"
                    name="numero"
                    control={form.control}
                    className="col-span-1"
                    isNumber={true}
                    errorMessage={form.formState.errors.numero?.message}
                    disabled={disabled}
                    maxLength={4}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Complemento"
                    name="complemento"
                    control={form.control}
                    className="col-span-3"
                    disabled={disabled}
                    maxLength={60}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Bairro*"
                    name="bairro"
                    control={form.control}
                    errorMessage={form.formState.errors.bairro?.message}
                    disabled={disabled}
                    className="col-span-3"
                    maxLength={60}
                  />
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cód. Cidade"
                    name="idCidade"
                    control={form.control}
                    isNumber={true}
                    disabled={true}
                    errorMessage={form.formState.errors.idCidade?.message}
                    className="col-span-1 row-start-3 row-end-3"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cidade"
                    name="cidade.cidade"
                    control={form.control}
                    disabled={true}
                    errorMessage={form.formState.errors.cidade?.message}
                    className="col-span-2 row-start-3 row-end-3"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="UF"
                    name="cidade.estado.uf"
                    control={form.control}
                    disabled={true}
                    className="col-span-1 row-start-3 row-end-3"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="País"
                    name="cidade.estado.pais.pais"
                    control={form.control}
                    disabled={true}
                    className="col-span-2 row-start-3 row-end-3"
                  />

                  <div className="relative !m-0 col-span-1 row-start-3 row-end-3">
                    <Dialog
                      open={openCidades}
                      onOpenChange={(value) => {
                        setCidade(undefined);
                        setOpenCidades(value);
                      }}
                    >
                      <DialogTrigger asChild className="absolute bottom-0">
                        <Button
                          variant="default"
                          className={`${action === "View" ? "hidden" : "visible"}`}
                          type="button"
                        >
                          <Search />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="!p-0 !max-w-4xl">
                        <CidadesPage setCidade={setCidade} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <Separator className="!mt-10 !mb-9" />
              <div className="border-2 p-5 flex flex-col gap-4">
                <H4 className="text-center">Dados da Função</H4>
                <div className="flex flex-row gap-4">
                  <InputMoney
                    control={form.control}
                    watch={form.watch}
                    labelName="Salário"
                    nameValor="salario"
                    maxLength={8}
                    disabled={disabled}
                    className="!w-[30em]"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cargo"
                    name="cargo"
                    control={form.control}
                    className="!w-[30em]"
                    disabled={disabled}
                    maxLength={50}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <InputCalendar
                    name="dtAdmissao"
                    label="Dt. Admissão"
                    setValue={form.setValue}
                    value={form.watch("dtAdmissao")}
                    control={form.control}
                    disabled={disabled}
                    fromDate={new Date(2019, 12, 23)}
                    toDate={new Date()}
                    className="row-start-2 col-span-2"
                  />

                  <InputCalendar<FuncionarioFormData>
                    name="dtDemissao"
                    label="Dt. Demissão"
                    setValue={form.setValue}
                    value={form.watch("dtDemissao")}
                    control={form.control}
                    disabled={disabled}
                    fromDate={new Date(2019, 12, 23)}
                    toDate={new Date()}
                    className="row-start-2 col-span-2"
                  />
                </div>
              </div>
              <Separator className="!mt-10 !mb-9" />
              <div className="grid grid-cols-8 gap-4 !m-0">
                <InputCalendar
                  name="dtCadastro"
                  label="Dt. Cadastro"
                  setValue={form.setValue}
                  value={form.watch("dtCadastro")}
                  control={form.control}
                  disabled={true}
                  className="col-span-2"
                />

                <InputCalendar
                  name="dtAlteracao"
                  label="Dt. Alteração"
                  setValue={form.setValue}
                  value={form.watch("dtAlteracao")}
                  control={form.control}
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

export default FuncionarioForm;
