import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Trash2 } from "lucide-react";
import { FormProvider, UseFormGetValues, UseFormSetValue, UseFormWatch, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Parcelas } from "@/pages/parcelas";
import { IParcela } from "@/interfaces/parcela.interfaces";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ParcelaForm } from "@/pages/parcelas/form";
import { formatMoney, formatPercentage } from "@/functions/functions";
import { Toaster, toast } from "sonner";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { ProdutoCompraFormData, ProdutoCompraFormSchema, defaultValues } from "./schema";
import { IProduto } from "@/interfaces/produto.interfaces";
import { ProdutosPage } from "@/pages/produtosPage";
import { formatCurrency } from "@/functions/masks";
import { CompraFormData } from "../form/schema";
import SearchItem from "@/components/searchItem";
import InputMoney from "@/components/form/inputMoney";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import useConfirmClose from "@/hooks/confirmClose";

interface produtoCompraFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  produtoCompra: IProdutoCompra | null;
  handleAddProdutoCompra: (value: IProdutoCompra) => void;
  handleEditProdutoCompra: (value: IProdutoCompra) => void;
  setValue: UseFormSetValue<CompraFormData>;
  getValue: UseFormGetValues<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  disabled?: boolean;
}

const ProdutoCompraForm = ({
  action,
  isOpen,
  onOpenChange,
  produtoCompra,
  handleAddProdutoCompra,
  handleEditProdutoCompra,
  setValue,
  getValue,
  watch,
  disabled = false,
}: produtoCompraFormProps) => {
  const [openProdutos, setOpenProdutos] = useState<boolean>(false);
  const [produto, setProduto] = useState<IProduto | undefined>(produtoCompra?.produto);

  const form = useForm<ProdutoCompraFormData>({
    mode: "onSubmit",
    resolver: zodResolver(ProdutoCompraFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
    "ProdutoCompra",
  );

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...produtoCompra,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  useEffect(() => {
    if (produto) {
      form.setValue("idProduto", produto?.id as number);
      form.setValue("produto", produto as IProduto);
      setOpenProdutos(false);
    }
  }, [produto]);

  useEffect(() => {
    const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
    const quantidade = isNaN(formatMoney(form.watch("quantidade"))) ? 0 : formatMoney(form.watch("quantidade"));

    form.setValue("desconto", 0);
    form.setValue("precoTotal", precoUnit * quantidade);
  }, [form.watch("precoUnit"), form.watch("quantidade")]);

  useEffect(() => {
    if (form.watch("desconto") === undefined || isNaN(Number(formatMoney(form.watch("desconto")))))
      form.setValue("desconto", 0);

    const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
    const desconto = isNaN(formatMoney(form.watch("desconto"))) ? 0 : formatMoney(form.watch("desconto"));
    const quantidade = isNaN(formatMoney(form.watch("quantidade"))) ? 0 : formatMoney(form.watch("quantidade"));
    const precoTotal = formatMoney(precoUnit * quantidade);

    if (precoUnit - desconto <= 0) {
      form.setValue("desconto", 0);
    } else if (desconto >= precoTotal) {
      form.setValue("desconto", 0);
      form.setValue("precoTotal", precoUnit * quantidade);
    } else {
      form.setValue("precoTotal", ((precoUnit - desconto) * quantidade).toFixed(2) as unknown as number);
    }
  }, [form.watch("desconto")]);

  const onSubmit = (data: IProdutoCompra) => {
    const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
    const desconto = isNaN(formatMoney(form.watch("desconto"))) ? 0 : formatMoney(form.watch("desconto"));
    const quantidade = isNaN(formatMoney(form.watch("quantidade"))) ? 0 : formatMoney(form.watch("quantidade"));

    if (precoUnit - desconto * quantidade < 1) {
      toast.error("O valor mínimo de compra é 1 real");
      form.setValue("precoUnit", 0);
    } else {
      if (action === "Add") {
        // data.precoTotal = data.precoUnit * data?.quantidade - data.desconto;
        handleAddProdutoCompra(data);
      } else {
        // data.precoTotal = data.precoUnit * data?.quantidade - data.desconto;
        handleEditProdutoCompra(data);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-md max-h-[80%] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {/* {condicaoPagamento ? "Atualizar a condição de pagamento" : "Adicionar nova condição de pagamento"} */}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <SearchItem
                  control={form.control}
                  getValue={form.getValues}
                  setValue={form.setValue}
                  watch={form.watch}
                  obj={produto}
                  setObj={setProduto}
                  openSearch={openProdutos}
                  setOpenSearch={setOpenProdutos}
                  labelCod="Cód. Produto"
                  nameCod="idProduto"
                  labelNome="Produto*"
                  nameNome="produto.produto"
                  errorMessage={form.formState.errors.idProduto?.message}
                  disabled={disabled}
                  page={<ProdutosPage setProduto={setProduto} />}
                  hiddenButton={action === "View" ? true : false}
                  className="flex flex-row gap-4 flex-grow"
                />

                {/* <FormFieldInput
                  trigger={form.trigger}
                  control={form.control}
                  label="Un. Medida"
                  name="produto.unidadeMedida.unidadeMedida"
                  disabled={true}
                  className="w-[20rem]"
                /> */}
              </div>
              <div className={`flex flex-row gap-4`}>
                <FormFieldInput
                  trigger={form.trigger}
                  label="Quantidade"
                  name="quantidade"
                  control={form.control}
                  disabled={false}
                  isNumber={true}
                  errorMessage={form.formState.errors.quantidade?.message}
                  className="col-span-3"
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  labelName="Preço Unitário"
                  nameValor="precoUnit"
                  disabled={form.watch("quantidade") === 0 ? true : false}
                  errorMessage={form.formState.errors.precoUnit?.message}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  labelName="Desconto"
                  nameValor="desconto"
                  disabled={form.watch("precoTotal") === 0 ? true : false}
                />

                <InputMoney
                  control={form.control}
                  watch={form.watch}
                  labelName="Preço Total"
                  nameValor="precoTotal"
                  disabled={true}
                />
              </div>

              <div>
                <Button type="submit" variant="default">
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

export default ProdutoCompraForm;
