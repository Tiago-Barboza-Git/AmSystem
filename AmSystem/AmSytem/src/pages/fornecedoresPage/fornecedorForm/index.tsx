import { zodResolver } from "@hookform/resolvers/zod";
import { PostFornecedor, PutFornecedor } from "../services/queries";
import { FornecedorFormData, FornecedorFormSchema, defaultValues } from "./schema";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { formatDate, removeSpecialCharacters } from "@/functions/functions";
import {
  formatJustNumbers,
  insertMaskCEP,
  insertMaskCNPJ,
  insertMaskCPF,
  insertMaskCel,
  insertMaskRG,
} from "@/functions/masks";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { IFornecedor } from "@/interfaces/fornecedor.interfaces";
import InputCalendar from "@/components/form/inputCalendar";
import { Search } from "lucide-react";
import { CidadesPage } from "@/pages/cidadesPage";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { subYears } from "date-fns";
import { H3, H4 } from "@/components/typography";

interface fornecedorFormProps {
  action: string;
  isOpen: boolean;
  fornecedor: IFornecedor | null;
  onOpenChange: (value: boolean) => void;
  setFornecedor?: (fornecedor: IFornecedor) => void;
}

const FornecedorForm = ({ action, isOpen, fornecedor, onOpenChange, setFornecedor }: fornecedorFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openCidades, setOpenCidades] = useState<boolean>(false);
  const [cidade, setCidade] = useState<ICidade | undefined>(fornecedor?.cidade);
  const putFornecedor = PutFornecedor(onOpenChange);
  const postFornecedor = PostFornecedor(onOpenChange);
  const form = useForm<FornecedorFormData>({
    mode: "onChange",
    resolver: zodResolver(FornecedorFormSchema),
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
        ...fornecedor,
      });
    } else {
      setDisabled(false);
      form.reset(defaultValues);
      form.setValue("tpPessoa", "J");
    }
  }, [isOpen]);

  useEffect(() => {
    form.setValue("idCidade", cidade?.id as number);
    form.setValue("cidade", cidade as ICidade);
    setOpenCidades(false);
  }, [cidade]);

  useEffect(() => {
    if (action === "Add") {
      const tpPessoa = form.getValues("tpPessoa");
      form.reset({
        ...defaultValues,
        tpPessoa: tpPessoa,
      });
    }
  }, [form.watch("tpPessoa")]);

  const onSubmit = (data: IFornecedor) => {
    if (openCidades === false) {
      data.cpfCnpj = removeSpecialCharacters(data.cpfCnpj);
      data.celular = removeSpecialCharacters(data.celular);
      data.ieRg = removeSpecialCharacters(data.ieRg as string);
      data.cep = removeSpecialCharacters(data.cep);
      if (action === "Edit") putFornecedor.mutate(data);
      else postFornecedor.mutate(data);
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
                  ? "Atualizar o fornecedor"
                  : action === "Add"
                    ? "Adicionar novo fornecedor"
                    : "Visualizar fornecedor"}
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
                  {/* <FormField
                    name="tpPessoa"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Tipo de Pessoa:</FormLabel>
                          <FormControl>
                            <RadioGroup
                              disabled={action === "Edit" || action === "View"}
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="F" id="fisica" />
                                <Label htmlFor="fisica">Física</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="J" id="juridica" />
                                <Label htmlFor="juridica">Jurídica</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  /> */}
                </div>

                <FormField
                  name="ativo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                    >
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={setFornecedor ? true : disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("tpPessoa") === "F" || form.watch("tpPessoa") === "J" ? (
                <>
                  <div className="border-2 p-5 flex flex-col gap-4">
                    <H4 className="text-center">Dados Pessoais</H4>
                    <div className="grid grid-cols-9 gap-4">
                      <FormFieldInput
                        trigger={form.trigger}
                        errorMessage={form.formState.errors.pessoaRazaoSocial?.message}
                        label={form.watch("tpPessoa") === "F" ? "Cliente*" : "Razão Social*"}
                        name="pessoaRazaoSocial"
                        control={form.control}
                        maxLength={100}
                        disabled={disabled}
                        className="col-span-4"
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label={form.watch("tpPessoa") === "F" ? "Apelido" : "Nome Fantasia"}
                        name="apelidoNomeFantasia"
                        control={form.control}
                        disabled={disabled}
                        maxLength={100}
                        className="col-span-3"
                        errorMessage={form.formState.errors.apelidoNomeFantasia?.message}
                      />

                      <FormField
                        name="sexo"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className={`col-span-2 ${form.watch("tpPessoa") === "F" ? "visible" : "hidden"}`}>
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
                        className="col-span-2"
                        maxLength={15}
                        disabled={disabled}
                        maskFunction={insertMaskCel}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Celular*"
                        name="celular"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-2"
                        maxLength={15}
                        errorMessage={form.formState.errors.celular?.message}
                        maskFunction={insertMaskCel}
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
                        label="Representante"
                        name="representante"
                        control={form.control}
                        disabled={disabled}
                        maxLength={100}
                        className={`col-span-4 ${form.watch("tpPessoa") === "F" ? "hidden" : "block"}`}
                        errorMessage={form.formState.errors.representante?.message}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Celular Representante"
                        name="celularRepresentante"
                        control={form.control}
                        disabled={disabled}
                        maskFunction={insertMaskCel}
                        maxLength={15}
                        className={`col-span-4 ${form.watch("tpPessoa") === "F" ? "hidden" : "block"}`}
                        errorMessage={form.formState.errors.celularRepresentante?.message}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label={form.watch("tpPessoa") === "F" ? "CPF*" : "CNPJ*"}
                        name="cpfCnpj"
                        control={form.control}
                        disabled={action === "Edit" ? true : disabled}
                        className="col-span-2"
                        errorMessage={form.formState.errors.cpfCnpj?.message}
                        maskFunction={form.watch("tpPessoa") === "F" ? insertMaskCPF : insertMaskCNPJ}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label={form.watch("tpPessoa") === "F" ? "RG" : "Inscrição Estadual"}
                        name="ieRg"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-2"
                        errorMessage={form.formState.errors.ieRg?.message}
                        maskFunction={form.watch("tpPessoa") === "F" ? insertMaskRG : formatJustNumbers}
                        // isNumber={form.watch("tpPessoa") === "J" ? true : undefined}
                        maxLength={14}
                      />

                      <InputCalendar
                        label={form.watch("tpPessoa") === "F" ? "Dt. Nascimento" : "Dt. Fundação"}
                        name="dtNascimento"
                        disabled={disabled}
                        control={form.control}
                        setValue={form.setValue}
                        value={form.watch("dtNascimento")}
                        fromDate={form.watch("tpPessoa") === "F" ? new Date(1910, 1, 1) : new Date(1850, 1, 1)}
                        toDate={form.watch("tpPessoa") === "F" ? subYears(new Date(), 18) : new Date()}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  <Separator className="!mt-10 !mb-9" />
                  <div className="border-2 p-5 flex flex-col gap-4">
                    <H4 className="text-center">Endereço</H4>
                    <div className="grid grid-cols-9 gap-4">
                      <FormFieldInput
                        trigger={form.trigger}
                        label="CEP*"
                        name="cep"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-3"
                        errorMessage={form.formState.errors.cep?.message}
                        maskFunction={insertMaskCEP}
                        maxLength={9}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Logradouro*"
                        name="logradouro"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-3"
                        errorMessage={form.formState.errors.logradouro?.message}
                        maxLength={50}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Número*"
                        name="numero"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-1"
                        isNumber={true}
                        maxLength={4}
                        errorMessage={form.formState.errors.numero?.message}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Complemento"
                        name="complemento"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-3"
                        maxLength={60}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Bairro*"
                        name="bairro"
                        control={form.control}
                        disabled={disabled}
                        className="col-span-3"
                        errorMessage={form.formState.errors.bairro?.message}
                        maxLength={60}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Cód. Cidade*"
                        name="idCidade"
                        control={form.control}
                        isNumber={true}
                        disabled={true}
                        errorMessage={form.formState.errors.idCidade?.message}
                        className="col-span-2 row-start-3"
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Cidade"
                        name="cidade.cidade"
                        control={form.control}
                        disabled={true}
                        errorMessage={form.formState.errors.cidade?.cidade?.message}
                        className="row-start-3 col-span-2"
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="UF"
                        name="cidade.estado.uf"
                        control={form.control}
                        disabled={true}
                        className="col-span-1 row-start-3"
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="País"
                        name="cidade.estado.pais.pais"
                        control={form.control}
                        disabled={true}
                        className="col-span-2 row-start-3"
                      />

                      <div className="relative row-start-3">
                        <Dialog
                          open={openCidades}
                          onOpenChange={(value) => {
                            setCidade(undefined);
                            setOpenCidades(value);
                          }}
                        >
                          <DialogTrigger asChild className="absolute bottom-0">
                            <Button variant="default">
                              <Search />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!p-0 max-w-4xl">
                            <CidadesPage setCidade={setCidade} justBrasil={true} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  <Separator className="!mt-10 !mb-9" />
                  <div className="grid grid-cols-8 gap-4 !m-0">
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
                </>
              ) : (
                <></>
              )}
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default FornecedorForm;
