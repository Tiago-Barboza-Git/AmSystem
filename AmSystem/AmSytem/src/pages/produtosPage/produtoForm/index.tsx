import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICidade } from "@/interfaces/cidade.interfaces";
import { ProdutoFormData, ProdutoFormSchema, defaultValues } from "./schema.tsx";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { formatDate, formatMoney } from "@/functions/functions.tsx";
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
import { formatCurrency } from "@/functions/masks.tsx";
import { CurrencyInput } from "react-currency-mask";
import InputCalendar from "@/components/form/inputCalendar/index.tsx";
import { IUnidadeMedida } from "@/interfaces/unidadeMedida.interfaces.tsx";
import { ICategoria } from "@/interfaces/categoria.interfaces.tsx";
import { UnidadesMedidasPage } from "@/pages/unidadeMedidaPage/index.tsx";
import { Search } from "lucide-react";
import { CategoriasPage } from "@/pages/categoriasPage/index.tsx";
import FormFieldTextArea from "@/components/form/textarea/index.tsx";
import InputMoney from "@/components/form/inputMoney/index.tsx";
import { Label } from "@/components/ui/label.tsx";
import SearchItem from "@/components/searchItem/index.tsx";
import useConfirmClose from "@/hooks/confirmClose/index.tsx";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm/index.tsx";
import { H2, H3, H4 } from "@/components/typography/index.tsx";
import { toast } from "sonner";

interface produtoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  produto: IProduto | null;
  setProduto?: (produto: IProduto) => void;
}

const ProdutoForm = ({ action, isOpen, onOpenChange, produto, setProduto }: produtoFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openUnidadesMedidas, setOpenUnidadesMedidas] = useState<boolean>(false);
  const [unidadeMedida, setUnidadeMedida] = useState<IUnidadeMedida | undefined>(produto?.unidadeMedida);
  const [openCategorias, setOpenCategorias] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<ICategoria | undefined>(produto?.categoria);

  const putProduto = PutProduto(onOpenChange);
  const postProduto = PostProduto(onOpenChange);
  const form = useForm<ProdutoFormData>({
    mode: "onSubmit",
    resolver: zodResolver(ProdutoFormSchema),
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
        ...produto,
      });
      form.setValue("idFornecedor", undefined);
    } else {
      setDisabled(false);
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

  // useEffect(() => {
  //   if (form.watch("precoVenda") - form.watch("desconto") <= form.watch("custoMedio")) {
  //     form.setValue("desconto", 0);
  //   } else {
  //   }
  // }, [form.watch("desconto")]);

  const onSubmit = (data: IProduto) => {
    if (openUnidadesMedidas === false && openCategorias == false) {
      const precoVenda = isNaN(formatMoney(form.watch("precoVenda"))) ? 0 : formatMoney(form.watch("precoVenda"));
      const custoMedio = isNaN(formatMoney(form.watch("custoMedio"))) ? 0 : formatMoney(form.watch("custoMedio"));

      if (custoMedio > 0) {
        if (precoVenda <= custoMedio) {
          toast.error("O preço de venda não pode ser menor ou igual ao custo médio");
        } else {
          data.precoVenda = formatMoney(data.precoVenda);
          data.precoUltCompra = formatMoney(data.precoUltCompra);
          data.custoMedio = formatMoney(data.custoMedio);
          if (action === "Edit") {
            putProduto.mutate(data);
          } else {
            postProduto.mutate(data);
          }
        }
      } else {
        data.precoVenda = formatMoney(data.precoVenda);
        data.precoUltCompra = formatMoney(data.precoUltCompra);
        data.custoMedio = formatMoney(data.custoMedio);
        if (action === "Edit") {
          putProduto.mutate(data);
        } else {
          postProduto.mutate(data);
        }
      }
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
                  ? "Atualizar o produto"
                  : action === "Add"
                    ? "Adicionar novo produto"
                    : "Visualizar produto"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-row justify-between col-span-6">
                <FormFieldInput
                  trigger={form.trigger}
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
                    <FormItem
                      className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                    >
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={setProduto ? true : action === "Add" ? true : disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row gap-4">
                <FormFieldInput
                  trigger={form.trigger}
                  label="Produto"
                  name="produto"
                  control={form.control}
                  errorMessage={form.formState.errors.produto?.message}
                  disabled={disabled}
                  className="w-[20rem]"
                  maxLength={50}
                />

                <div className={`${action === "Add" ? "hidden" : "visible"} flex flex-row gap-4 `}>
                  <InputMoney
                    control={form.control}
                    watch={form.watch}
                    labelName="Preço Venda"
                    nameValor="precoVenda"
                    disabled={form.watch("custoMedio") === 0 ? true : disabled}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Quantidade"
                    name="quantidade"
                    control={form.control}
                    errorMessage={form.formState.errors.quantidade?.message}
                    isNumber={true}
                    disabled={true}
                    className="col-span-1"
                  />

                  {/* <InputMoney
                    control={form.control}
                    labelName="Desconto"
                    nameValor="desconto"
                    watch={form.watch}
                    disabled={form.watch("precoVenda") === 0 ? true : disabled}
                  /> */}

                  <InputMoney
                    control={form.control}
                    watch={form.watch}
                    labelName="Custo Médio"
                    nameValor="custoMedio"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="col-span-3">
                  <SearchItem
                    control={form.control}
                    getValue={form.getValues}
                    setValue={form.setValue}
                    watch={form.watch}
                    obj={unidadeMedida}
                    setObj={setUnidadeMedida}
                    openSearch={openUnidadesMedidas}
                    setOpenSearch={setOpenUnidadesMedidas}
                    labelCod="Cód. Un. Medida*"
                    nameCod="idUnidadeMedida"
                    labelNome="Un. Medida*"
                    nameNome="unidadeMedida.unidadeMedida"
                    errorMessage={form.formState.errors?.idUnidadeMedida?.message}
                    disabled={disabled}
                    page={<UnidadesMedidasPage setUnidadeMedida={setUnidadeMedida} />}
                    hiddenButton={disabled === true ? true : false}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>

                <div className="col-span-3">
                  <SearchItem
                    control={form.control}
                    getValue={form.getValues}
                    setValue={form.setValue}
                    watch={form.watch}
                    obj={categoria}
                    setObj={setCategoria}
                    openSearch={openCategorias}
                    setOpenSearch={setOpenCategorias}
                    labelCod="Cód. Categoria*"
                    nameCod="idCategoria"
                    labelNome="Categoria*"
                    nameNome="categoria.categoria"
                    errorMessage={form.formState.errors?.idCategoria?.message}
                    disabled={disabled}
                    page={<CategoriasPage setCategoria={setCategoria} />}
                    hiddenButton={disabled === true ? true : false}
                    className="flex flex-row gap-4 flex-grow"
                  />
                </div>
              </div>

              <FormFieldTextArea
                control={form.control}
                name="observacao"
                label="Observação"
                className="col-span-6"
                disabled={disabled}
                maxLength={80}
              />

              <div
                className={`${action === "Add" ? "hidden" : "visible"} col-span-6 border-2 border-gray-200 rounded-lg p-5 flex flex-col gap-4`}
              >
                <H4 className="text-center">Última compra</H4>
                <div className="flex flex-row gap-4 ">
                  <InputMoney
                    control={form.control}
                    watch={form.watch}
                    labelName="Preço Ult. Compra"
                    nameValor="precoUltCompra"
                    disabled={true}
                  />

                  <InputMoney
                    control={form.control}
                    watch={form.watch}
                    labelName="Custo Ult. Compra"
                    nameValor="custoUnitUltCompra"
                    disabled={true}
                  />

                  <InputCalendar
                    label="Dt. Ult. Compra"
                    name="dtUltCompra"
                    control={form.control}
                    setValue={form.setValue}
                    value={form.watch("dtUltCompra")}
                    disabled={true}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cod. Fornecedor"
                    name="fornecedor.id"
                    control={form.control}
                    disabled={true}
                    className="w-[15%]"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    label="Fornecedor"
                    name="fornecedor.pessoaRazaoSocial"
                    control={form.control}
                    disabled={true}
                    className="w-[30%]"
                  />
                </div>
              </div>

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
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default ProdutoForm;
