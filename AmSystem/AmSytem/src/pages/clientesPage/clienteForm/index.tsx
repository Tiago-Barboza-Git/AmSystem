import { zodResolver } from "@hookform/resolvers/zod";
import { PostCliente, PutCliente } from "../services/queries";
import { ClienteFormData, ClienteFormSchema, defaultValues } from "./schema";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { formatDate, formatMoney, removeSpecialCharacters } from "@/functions/functions";
import {
  formatJustNumbers,
  insertMaskCEP,
  insertMaskCNPJ,
  insertMaskCPF,
  insertMaskCel,
  insertMaskRG,
} from "@/functions/masks";
import { iCliente } from "@/interfaces/cliente.interfaces";
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
import { GetCidades } from "@/pages/cidadesPage/services/queries";
import FormFieldInput from "@/components/form/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { format, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { DateObject } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
import "./style.css";
import { Calendar } from "@/components/calendar";
import InputCalendar from "@/components/form/inputCalendar";
import { CidadesPage } from "@/pages/cidadesPage";
import { Search } from "lucide-react";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import useConfirmClose from "@/hooks/confirmClose";
import { H3, H4 } from "@/components/typography";

interface clienteFormProps {
  action: string;
  isOpen: boolean;
  cliente: iCliente | null;
  onOpenChange: (value: boolean) => void;
  setCliente?: (fornecedor: iCliente) => void;
}

const ClienteForm = ({ action, isOpen, cliente, onOpenChange, setCliente }: clienteFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openCidades, setOpenCidades] = useState<boolean>(false);
  const [cidade, setCidade] = useState<ICidade | undefined>(cliente?.cidade);

  const putCliente = PutCliente(onOpenChange);
  const postCliente = PostCliente(onOpenChange);

  const form = useForm<ClienteFormData>({
    mode: "onChange",
    resolver: zodResolver(ClienteFormSchema),
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
      form.reset({ ...cliente });
    } else {
      setDisabled(false);
      form.reset(defaultValues);
    }
  }, [isOpen]);

  useEffect(() => {
    if (cidade !== undefined) {
      form.setValue("idCidade", cidade?.id as number);
      form.setValue("cidade", cidade as ICidade);
      setOpenCidades(false);
    }
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

  const onSubmit = (data: iCliente) => {
    if (openCidades === false) {
      data.cpfCnpj = removeSpecialCharacters(data.cpfCnpj);
      data.celular = removeSpecialCharacters(data.celular);
      data.ieRg = removeSpecialCharacters(data.ieRg as string);
      data.cep = removeSpecialCharacters(data.cep);
      if (action === "Edit") putCliente.mutate(data);
      else postCliente.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-lg max-h-[80%] overflow-y-scroll"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar o cliente"
                  : action === "Add"
                    ? "Adicionar novo cliente"
                    : "Visualizar cliente"}
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
                    className="w-[5rem]"
                    errorMessage={form.formState.errors.id?.message}
                    isNumber={true}
                    disabled={true}
                  />
                  <FormField
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
                  />
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
                          disabled={setCliente ? true : action === "Add" ? true : disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("tpPessoa") === "F" || form.watch("tpPessoa") === "J" ? (
                <>
                  <div className="border-2 p-5 flex flex-col">
                    <H4 className="text-center">Dados Pessoais</H4>
                    <div className="grid grid-cols-9 gap-4">
                      <FormFieldInput
                        trigger={form.trigger}
                        errorMessage={form.formState.errors.pessoaRazaoSocial?.message}
                        label={form.watch("tpPessoa") === "F" ? "Cliente*" : "Razão Social*"}
                        name="pessoaRazaoSocial"
                        control={form.control}
                        disabled={disabled}
                        maxLength={100}
                        className="col-span-4"
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label={form.watch("tpPessoa") === "F" ? "Apelido" : "Nome Fantasia"}
                        name="apelidoNomeFantasia"
                        control={form.control}
                        disabled={disabled}
                        errorMessage={form.formState.errors.apelidoNomeFantasia?.message}
                        maxLength={100}
                        className="col-span-3"
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
                        control={form.control}
                        label="Telefone"
                        name="telefone"
                        errorMessage={form.formState.errors.telefone?.message}
                        disabled={disabled}
                        maxLength={15}
                        maskFunction={insertMaskCel}
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
                        maxLength={70}
                        className="col-span-4"
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
                        maskFunction={insertMaskCel}
                        disabled={disabled}
                        className={`col-span-4 ${form.watch("tpPessoa") === "F" ? "hidden" : "block"}`}
                        maxLength={15}
                        errorMessage={form.formState.errors.celularRepresentante?.message}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label={form.watch("tpPessoa") === "F" ? "CPF" : "CNPJ*"}
                        name="cpfCnpj"
                        control={form.control}
                        disabled={disabled}
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
                        maxLength={14}
                      />

                      <InputCalendar
                        control={form.control}
                        label={form.watch("tpPessoa") === "F" ? "Dt. Nascimento" : "Dt. Fundação"}
                        name="dtNascimento"
                        disabled={disabled}
                        setValue={form.setValue}
                        value={form.watch("dtNascimento")}
                        errorMessage={form.formState.errors.dtNascimento?.message}
                        fromDate={form.watch("tpPessoa") === "F" ? new Date(1910, 1, 1) : new Date(1850, 1, 1)}
                        toDate={form.watch("tpPessoa") === "F" ? subYears(new Date(), 18) : new Date()}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  <Separator className="!mt-10 !mb-9" />
                  <div className="!m-0 border-2 p-5">
                    <H4 className="text-center">Endereço</H4>
                    <div className="grid grid-cols-9 grid-rows-3 gap-4">
                      <FormFieldInput
                        trigger={form.trigger}
                        control={form.control}
                        label="CEP*"
                        name="cep"
                        className="col-span-3"
                        errorMessage={form.formState.errors.cep?.message}
                        maskFunction={insertMaskCEP}
                        disabled={disabled}
                        maxLength={9}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        control={form.control}
                        label="Logradouro*"
                        name="logradouro"
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
                        disabled={disabled}
                        isNumber={true}
                        maxLength={4}
                        errorMessage={form.formState.errors.numero?.message}
                      />

                      <FormFieldInput
                        trigger={form.trigger}
                        label="Complemento"
                        name="complemento"
                        control={form.control}
                        className="col-span-3"
                        disabled={disabled}
                        errorMessage={form.formState.errors.complemento?.message}
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
                        label="Cidade*"
                        name="cidade.cidade"
                        control={form.control}
                        disabled={true}
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
                            <Button variant="default" className={`${action === "View" ? "hidden" : "visible"}`}>
                              <Search />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!p-0 max-w-4xl">
                            <CidadesPage setCidade={setCidade} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  <Separator className="!mt-10 !mb-9" />
                  <div className="grid grid-cols-8 gap-4 !m-0">
                    <InputCalendar
                      label="Dt. Cadastro"
                      control={form.control}
                      name="dtCadastro"
                      setValue={form.setValue}
                      value={form.watch("dtCadastro")}
                      disabled={true}
                      className="col-span-2"
                    />

                    <InputCalendar
                      label="Dt. Alteração"
                      control={form.control}
                      name="dtAlteracao"
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
                      className={`${action === "View" ? "hidden" : "visible"}  w-[15rem]`}
                      onClick={handleCloseDialog}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      className={`${action === "View" ? "hidden" : "visible"} bg-[#4A90E2] w-[15rem] hover:bg-[#2b5c95]`}
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

export default ClienteForm;
