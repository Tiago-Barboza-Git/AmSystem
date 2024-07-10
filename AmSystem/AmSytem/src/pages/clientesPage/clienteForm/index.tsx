import { zodResolver } from "@hookform/resolvers/zod";
import { PostCliente, PutCliente } from "../services/queries";
import { ClienteFormData, ClienteFormSchema, defaultValues } from "./schema";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { formatDate, removeSpecialCharacters } from "@/functions/functions";
import {
  insertMaskCEP,
  insertMaskCNPJ,
  insertMaskCPF,
  insertMaskCel,
  insertMaskRG,
} from "@/functions/masks";
import { iCliente } from "@/interfaces/cliente.interfaces";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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

interface clienteFormProps {
  action: string;
  isOpen: boolean;
  cliente: iCliente | null;
  onOpenChange: (value: boolean) => void;
}

const ClienteForm = ({
  action,
  isOpen,
  cliente,
  onOpenChange,
}: clienteFormProps) => {
  const [openCidades, setOpenCidades] = useState<boolean>(false);
  const [cidade, setCidade] = useState<ICidade | undefined>(cliente?.cidade);
  const putCliente = PutCliente(onOpenChange);
  const postCliente = PostCliente(onOpenChange);
  const form = useForm<ClienteFormData>({
    mode: "onChange",
    resolver: zodResolver(ClienteFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...cliente,
      });
    } else {
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
    const tpCliente = form.getValues("tpCliente");
    form.reset({
      ...defaultValues,
      tpCliente: tpCliente,
    });
  }, [form.watch("tpCliente")]);

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen-lg max-h-[80%] overflow-y-scroll"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Atualizar o cliente" : "Adicionar novo cliente"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-4">
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
                  name="tpCliente"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Tipo de Pessoa:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            disabled={action === "Edit"}
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
            {form.watch("tpCliente") === "F" ||
            form.watch("tpCliente") === "J" ? (
              <>
                <Separator className="!mt-10 !mb-9" />
                <div className="!m-0">
                  <Label>Dados Pessoais</Label>
                  <div className="grid grid-cols-9 gap-4">
                    <FormFieldInput<ClienteFormData>
                      errorMessage={
                        form.formState.errors.clienteRazaoSocial?.message
                      }
                      label={
                        form.watch("tpCliente") === "F"
                          ? "Cliente*"
                          : "Razão Social*"
                      }
                      name="clienteRazaoSocial"
                      control={form.control}
                      className="col-span-4"
                    />

                    <FormFieldInput
                      label={
                        form.watch("tpCliente") === "F"
                          ? "Apelido"
                          : "Nome Fantasia"
                      }
                      name="apelidoNomeFantasia"
                      control={form.control}
                      className="col-span-3"
                      errorMessage={
                        form.formState.errors.apelidoNomeFantasia?.message
                      }
                    />

                    <FormField
                      name="sexo"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem
                          className={`col-span-2 ${
                            form.watch("tpCliente") === "F"
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <FormLabel>Sexo*</FormLabel>
                          <FormControl {...field}>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
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
                          <FormLabel className="text-xs">
                            {form.formState.errors.sexo?.message}
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormFieldInput
                      label="Telefone"
                      name="telefone"
                      control={form.control}
                      className="col-span-2"
                    />

                    <FormFieldInput
                      label="Celular*"
                      name="celular"
                      control={form.control}
                      className="col-span-2"
                      errorMessage={form.formState.errors.celular?.message}
                      maskFunction={insertMaskCel}
                    />

                    <FormFieldInput
                      label="Email*"
                      name="email"
                      control={form.control}
                      className="col-span-4"
                      errorMessage={form.formState.errors.email?.message}
                    />

                    <FormFieldInput
                      label="Representante"
                      name="representante"
                      control={form.control}
                      className={`col-span-4 ${
                        form.watch("tpCliente") === "F" ? "hidden" : "block"
                      }`}
                      errorMessage={
                        form.formState.errors.representante?.message
                      }
                    />

                    <FormFieldInput
                      label="Celular Representante"
                      name="celularRepresentante"
                      control={form.control}
                      maskFunction={insertMaskCel}
                      className={`col-span-4 ${
                        form.watch("tpCliente") === "F" ? "hidden" : "block"
                      }`}
                      errorMessage={
                        form.formState.errors.celularRepresentante?.message
                      }
                    />

                    <FormFieldInput
                      label={form.watch("tpCliente") === "F" ? "CPF*" : "CNPJ*"}
                      name="cpfCnpj"
                      control={form.control}
                      className="col-span-2"
                      errorMessage={form.formState.errors.cpfCnpj?.message}
                      maskFunction={
                        form.watch("tpCliente") === "F"
                          ? insertMaskCPF
                          : insertMaskCNPJ
                      }
                    />

                    <FormFieldInput
                      label={
                        form.watch("tpCliente") === "F"
                          ? "RG"
                          : "Inscrição Estadual"
                      }
                      name="ieRg"
                      control={form.control}
                      className="col-span-2"
                      errorMessage={form.formState.errors.ieRg?.message}
                      maskFunction={
                        form.watch("tpCliente") === "F"
                          ? insertMaskRG
                          : undefined
                      }
                    />

                    <InputCalendar
                      control={form.control}
                      label="Dt. Nascimento"
                      name="dtNascimento"
                      setValue={form.setValue}
                      value={form.watch("dtNascimento")}
                      className="col-span-2"
                    />
                  </div>
                </div>
                <Separator className="!mt-10 !mb-9" />
                <div className="!m-0">
                  <Label className="text-md">Endereço</Label>
                  <div className="grid grid-cols-9 grid-rows-3 gap-4">
                    <FormFieldInput
                      label="CEP*"
                      name="cep"
                      control={form.control}
                      className="col-span-3"
                      errorMessage={form.formState.errors.cep?.message}
                      maskFunction={insertMaskCEP}
                    />

                    <FormFieldInput
                      label="Rua*"
                      name="endereco"
                      control={form.control}
                      className="col-span-3"
                      errorMessage={form.formState.errors.endereco?.message}
                    />

                    <FormFieldInput
                      label="Número*"
                      name="numero"
                      control={form.control}
                      className="col-span-1"
                      isNumber={true}
                      errorMessage={form.formState.errors.numero?.message}
                    />

                    <FormFieldInput
                      label="Complemento"
                      name="complemento"
                      control={form.control}
                      className="col-span-3"
                    />

                    <FormFieldInput
                      label="Bairro*"
                      name="bairro"
                      control={form.control}
                      className="col-span-3"
                      errorMessage={form.formState.errors.bairro?.message}
                    />

                    <FormFieldInput
                      label="Cód. Cidade*"
                      name="idCidade"
                      control={form.control}
                      isNumber={true}
                      disabled={true}
                      className="col-span-2 row-start-3 col-span-1"
                    />

                    <FormFieldInput
                      label="Cidade*"
                      name="cidade.cidade"
                      control={form.control}
                      disabled={true}
                      className="row-start-3 col-span-2"
                    />

                    <FormFieldInput
                      label="UF"
                      name="cidade.estado.uf"
                      control={form.control}
                      disabled={true}
                      className="col-span-1 row-start-3"
                    />

                    <FormFieldInput
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
                        <DialogContent className="!p-0">
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
                <Button type="submit" variant="default">
                  Salvar
                </Button>
              </>
            ) : (
              <></>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;