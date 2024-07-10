import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICidade } from "@/interfaces/cidade.interfaces";
import {
  ProdutoFormData,
  ProdutoFormSchema,
  defaultValues,
} from "./schema.tsx";
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
import { PostProduto, PutProduto } from "../services/queries.tsx";
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
import { IProduto } from "@/interfaces/produto.interfaces.tsx";
import { currencyFormatter } from "@/components/form/inputMoney/index.tsx";
import { formatCurrency } from "@/functions/masks.tsx";
import { CurrencyInput } from "react-currency-mask";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import { formToJSON } from "axios";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces.tsx";
import { ICategoria } from "@/interfaces/categoria.interfaces.tsx";
import { UnidadesMedidasPage } from "@/pages/unidadeMedidaPage/index.tsx";
import { Search } from "lucide-react";
import { CategoriasPage } from "@/pages/categoriasPage/index.tsx";
import FormFieldTextArea from "@/components/form/textarea/index.tsx";

interface produtoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  produto: IProduto | null;
}

const ProdutoForm = ({
  action,
  isOpen,
  onOpenChange,
  produto,
}: produtoFormProps) => {
  const [openUnidadesMedidas, setOpenUnidadesMedidas] =
    useState<boolean>(false);
  const [unidadeMedida, setUnidadeMedida] = useState<
    IUnidadeMedida | undefined
  >(produto?.unidadeMedida);
  const [openCategorias, setOpenCategorias] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<ICategoria | undefined>(
    produto?.categoria
  );

  const putProduto = PutProduto(onOpenChange);
  const postProduto = PostProduto(onOpenChange);
  const form = useForm<ProdutoFormData>({
    mode: "onChange",
    resolver: zodResolver(ProdutoFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...produto,
      });
      form.setValue("idFornecedor", undefined);
    } else {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  useEffect(() => {
    form.setValue("idCategoria", categoria?.id as number);
    form.setValue("categoria", categoria as ICategoria);
    setOpenCategorias(false);
  }, [categoria]);

  useEffect(() => {
    form.setValue("idUnidadeMedida", unidadeMedida?.id as number);
    form.setValue("unidadeMedida", unidadeMedida as IUnidadeMedida);
    setOpenUnidadesMedidas(false);
  }, [unidadeMedida]);

  const onSubmit = (data: IProduto) => {
    if (openUnidadesMedidas === false && openCategorias == false) {
      data.precoVenda = formatCurrency(data.precoVenda?.toString());
      data.precoUltCompra = formatCurrency(data.precoUltCompra?.toString());
      data.custoMedio = formatCurrency(data.custoMedio?.toString());
      if (action === "Edit") {
        putProduto.mutate(data);
      } else {
        postProduto.mutate(data);
      }
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
            {produto ? "Atualizar o produto" : "Adicionar novo produto"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-4">
              <div className="flex flex-row justify-between col-span-6">
                <FormFieldInput
                  className="col-span-2"
                  label="Cód."
                  name="id"
                  control={form.control}
                  errorMessage={form.formState.errors.id?.message}
                  isNumber={true}
                  disabled={true}
                />

                <FormField
                  name="ativo"
                  control={form.control}
                  defaultValue={produto?.ativo}
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

              <FormFieldInput
                label="Produto"
                name="produto"
                control={form.control}
                errorMessage={form.formState.errors.produto?.message}
                className="col-span-3"
              />

              <FormFieldInput
                label="Quantidade"
                name="quantidade"
                control={form.control}
                errorMessage={form.formState.errors.quantidade?.message}
                isNumber={true}
                disabled={true}
                className="col-span-1"
              />

              <FormField
                name="precoVenda"
                control={form.control}
                defaultValue={produto?.precoVenda}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 col-span-1">
                    <FormLabel>Preço de Venda</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        defaultValue={field.value}
                        onChangeValue={field.onChange}
                        currency="BRL"
                        locale="pt-BR"
                        InputElement={<Input defaultValue={field.value} />}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.quantidade?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="precoUltCompra"
                control={form.control}
                disabled={true}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 col-span-1 row-start-3">
                    <FormLabel>Preço Ult. Compra</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        defaultValue={field.value ? field.value : undefined}
                        onChangeValue={field.onChange}
                        currency="BRL"
                        locale="pt-BR"
                        InputElement={
                          <Input disabled={true} defaultValue={field.value} />
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="custoMedio"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 col-span-1 row-start-3">
                    <FormLabel>Custo Médio</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        defaultValue={field.value}
                        onChangeValue={field.onChange}
                        currency="BRL"
                        locale="pt-BR"
                        InputElement={
                          <Input disabled={true} defaultValue={field.value} />
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <InputCalendar
                label="Dt. Ult. Compra"
                name="dtUltCompra"
                control={form.control}
                setValue={form.setValue}
                value={form.watch("dtUltCompra")}
                disabled={true}
                className="col-span-2"
              />

              <FormFieldTextArea
                control={form.control}
                name="observacao"
                label="Observação"
                className="col-span-6"
              />

              <div className="col-span-3 grid grid-cols-6 gap-4">
                <FormFieldInput
                  label="Cód. Un. de Med."
                  name="idUnidadeMedida"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Un. de Medida"
                  name="unidadeMedida.unidadeMedida"
                  control={form.control}
                  disabled={true}
                  className="col-span-3"
                />

                <div className="relative">
                  <Dialog
                    open={openUnidadesMedidas}
                    onOpenChange={(value) => setOpenUnidadesMedidas(value)}
                  >
                    <DialogTrigger asChild className="absolute bottom-0">
                      <Button variant="default">
                        <Search />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="!p-0">
                      <UnidadesMedidasPage
                        setUnidadeMedida={setUnidadeMedida}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="col-span-3 grid grid-cols-8 gap-4">
                <FormFieldInput
                  label="Cód. Categoria"
                  name="idCategoria"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Categoria"
                  name="categoria.categoria"
                  control={form.control}
                  disabled={true}
                  className="col-span-4"
                />

                <div className="relative">
                  <Dialog
                    open={openCategorias}
                    onOpenChange={(value) => setOpenCategorias(value)}
                  >
                    <DialogTrigger asChild className="absolute bottom-0">
                      <Button variant="default">
                        <Search />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="!p-0">
                      <CategoriasPage setCategoria={setCategoria} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <FormFieldInput
                label="Principal Fornecedor"
                name="fornecedor.fornecedorRazaoSocial"
                control={form.control}
                disabled={true}
                className="col-span-3"
              />

              <div className="grid grid-cols-8 gap-4 !m-0 col-span-6">
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
  );
};

export default ProdutoForm;
