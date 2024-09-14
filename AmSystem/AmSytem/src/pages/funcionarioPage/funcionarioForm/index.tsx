import { zodResolver } from "@hookform/resolvers/zod";
import { PostFuncionario, PutFuncionario } from "../services/queries";
import {
  FuncionarioFormData,
  FuncionarioFormSchema,
  defaultValues,
} from "./schema";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { removeSpecialCharacters } from "@/functions/functions";
import {
  formatPISPASEP,
  insertMaskCEP,
  insertMaskCPF,
  insertMaskCel,
} from "@/functions/masks";
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
} from "@/components/ui/form";
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

interface funcionarioFormProps {
  action: string;
  isOpen: boolean;
  funcionario: IFuncionario | null;
  onOpenChange: (value: boolean) => void;
}

const FuncionarioForm = ({
  action,
  isOpen,
  funcionario,
  onOpenChange,
}: funcionarioFormProps) => {
  const [openCidades, setOpenCidades] = useState<boolean>(false);
  const [cidade, setCidade] = useState<ICidade | undefined>();
  const putFuncionario = PutFuncionario(onOpenChange);
  const postFuncionario = PostFuncionario(onOpenChange);
  const form = useForm<FuncionarioFormData>({
    mode: "onChange",
    resolver: zodResolver(FuncionarioFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...funcionario,
      });
    } else {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen-lg max-h-[80%] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {funcionario
              ? "Atualizar o funcionário"
              : "Adicionar novo funcionário"}
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
            </div>

            <Separator className="!mt-10 !mb-9" />
            <div className="!m-0 flex flex-col gap-4">
              <Label>Dados Pessoais</Label>
              <div className="grid grid-cols-9 gap-4">
                <FormFieldInput<FuncionarioFormData>
                  errorMessage={form.formState.errors.funcionario?.message}
                  label="Funcionário*"
                  name="funcionario"
                  control={form.control}
                  className="col-span-4"
                />

                <FormFieldInput
                  label="Apelido"
                  name="apelido"
                  control={form.control}
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
                  maskFunction={insertMaskCel}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Celular*"
                  name="celular"
                  control={form.control}
                  errorMessage={form.formState.errors.celular?.message}
                  maskFunction={insertMaskCel}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Email*"
                  name="email"
                  control={form.control}
                  className="col-span-4"
                  errorMessage={form.formState.errors.email?.message}
                />

                <FormFieldInput
                  label="CPF*"
                  name="cpf"
                  control={form.control}
                  errorMessage={form.formState.errors.cpf?.message}
                  maskFunction={insertMaskCPF}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="RG"
                  name="rg"
                  control={form.control}
                  errorMessage={form.formState.errors.rg?.message}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="PIS"
                  name="pis"
                  control={form.control}
                  maskFunction={formatPISPASEP}
                  className="col-span-2"
                />

                <div className="flex flex-col gap-[1.12rem] col-span-2">
                  <InputCalendar
                    name="dtNascimento"
                    label="Dt. Nascimento"
                    setValue={form.setValue}
                    value={form.watch("dtNascimento")}
                    control={form.control}
                  />
                </div>
              </div>
            </div>
            <Separator className="!mt-10 !mb-9" />
            <div className="!m-0 flex flex-col gap-4">
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
                  name="logradouro"
                  control={form.control}
                  className="col-span-3"
                  errorMessage={form.formState.errors.logradouro?.message}
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
                  errorMessage={form.formState.errors.bairro?.message}
                  className="col-span-3"
                />
                <FormFieldInput
                  label="Cód. Cidade"
                  name="idCidade"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                  className="col-span-1 row-start-3 row-end-3"
                />

                <FormFieldInput
                  label="Cidade"
                  name="cidade.cidade"
                  control={form.control}
                  disabled={true}
                  className="col-span-2 row-start-3 row-end-3"
                />

                <FormFieldInput
                  label="UF"
                  name="cidade.estado.uf"
                  control={form.control}
                  disabled={true}
                  className="col-span-1 row-start-3 row-end-3"
                />

                <FormFieldInput
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
            <div className="flex flex-col gap-4">
              <Label>Dados da Função</Label>
              <div className="grid grid-cols-8 grid-rows-2 gap-4">
                <FormField
                  name="salario"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2 gap-2">
                      <FormLabel>Salário</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          defaultValue={field.value}
                          onChangeValue={field.onChange}
                          autoReset={true}
                          currency="BRL"
                          locale="pt-BR"
                          InputElement={<Input defaultValue={field.value} />}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormFieldInput
                  label="Cargo"
                  name="cargo"
                  control={form.control}
                  className="col-span-4"
                />

                <InputCalendar
                  name="dtAdmissao"
                  label="Dt. Admissão"
                  setValue={form.setValue}
                  value={form.watch("dtAdmissao")}
                  control={form.control}
                  className="row-start-2 col-span-2"
                />

                <InputCalendar<FuncionarioFormData>
                  name="dtDemissao"
                  label="Dt. Demissão"
                  setValue={form.setValue}
                  value={form.watch("dtDemissao")}
                  control={form.control}
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
            <Button type="submit" variant="default">
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default FuncionarioForm;
