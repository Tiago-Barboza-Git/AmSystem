import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { InspectionPanelIcon, Search, Trash2 } from "lucide-react";
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
import { ProdutoVendaFormData, ProdutoVendaFormSchema, defaultValues } from "./schema";
import { IProduto } from "@/interfaces/produto.interfaces";
import { ProdutosPage } from "@/pages/produtosPage";
import { formatCurrency } from "@/functions/masks";
import { VendaFormData } from "../form/schema";
import SearchItem from "@/components/searchItem";
import InputMoney from "@/components/form/inputMoney";
import { IProdutoVenda } from "@/interfaces/Venda/produtoVenda.interfaces";

interface produtoVendaFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  produtoVenda: IProdutoVenda | null;
  handleAddProdutoVenda: (value: IProdutoVenda) => void;
  handleEditProdutoVenda: (value: IProdutoVenda) => void;
  setValue: UseFormSetValue<VendaFormData>;
  getValue: UseFormGetValues<VendaFormData>;
  watch: UseFormWatch<VendaFormData>;
  disabled?: boolean;
}

const ProdutoVendaForm = ({
  action,
  isOpen,
  onOpenChange,
  produtoVenda,
  handleAddProdutoVenda,
  handleEditProdutoVenda,
  setValue,
  getValue,
  watch,
  disabled = false,
}: produtoVendaFormProps) => {
  const [openProdutos, setOpenProdutos] = useState<boolean>(false);
  const [produto, setProduto] = useState<IProduto | undefined>(produtoVenda?.produto);

  const form = useForm<ProdutoVendaFormData>({
    mode: "onSubmit",
    resolver: zodResolver(ProdutoVendaFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (action === "Edit") {
      form.reset({
        ...produtoVenda,
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
    if (isOpen) {
      const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
      const quantidade = isNaN(formatMoney(form.watch("quantidade"))) ? 0 : formatMoney(form.watch("quantidade"));

      form.setValue("desconto", 0);
      form.setValue("precoTotal", precoUnit * quantidade - form.watch("desconto"));
    }
  }, [form.watch("precoUnit"), form.watch("quantidade")]);

  const onSubmit = (data: IProdutoVenda) => {
    if (openProdutos === false) {
      const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
      const desconto = isNaN(formatMoney(form.watch("desconto"))) ? 0 : formatMoney(form.watch("desconto"));

      if (precoUnit - desconto <= form.watch("produto.custoMedio")) {
        toast.error("O preço unitário não pode ser inferior ao custo médio!");
        return;
      }

      if (produto && data.quantidade > produto.quantidade) {
        toast.error("A quantidade vendida é superior ao estoque!");
      } else {
        if (action === "Add") {
          // data.precoTotal = data.precoUnit * data?.quantidade - data.desconto;
          data.desconto = formatMoney(data.desconto);
          handleAddProdutoVenda(data);
        } else {
          // data.precoTotal = data.precoUnit * data?.quantidade - data.desconto;
          handleEditProdutoVenda(data);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (form.watch("desconto") === undefined || isNaN(Number(formatMoney(form.watch("desconto")))))
        form.setValue("desconto", 0);

      const precoUnit = isNaN(formatMoney(form.watch("precoUnit"))) ? 0 : formatMoney(form.watch("precoUnit"));
      const desconto = isNaN(formatMoney(form.watch("desconto"))) ? 0 : formatMoney(form.watch("desconto"));
      const quantidade = isNaN(formatMoney(form.watch("quantidade"))) ? 0 : formatMoney(form.watch("quantidade"));
      const precoTotal = formatMoney(precoUnit * quantidade);
      if (desconto >= precoUnit || precoUnit - desconto <= form.watch("produto.custoMedio")) {
        form.setValue("desconto", 0);
        form.setValue("precoTotal", precoTotal);
        toast.error("O preço unitário não pode ser inferior ao custo médio!");
      } else {
        form.setValue("precoTotal", ((precoUnit - desconto) * quantidade).toFixed(2) as unknown as number);
      }
    }
  }, [form.watch("desconto")]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                labelCod="Cód. Produto*"
                nameCod="idProduto"
                labelNome="Produto*"
                nameNome="produto.produto"
                errorMessage={form.formState.errors.idProduto?.message}
                disabled={disabled}
                page={<ProdutosPage setProduto={setProduto} estoque={true} />}
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
            <div className="flex flex-row gap-4">
              <FormFieldInput
                trigger={form.trigger}
                control={form.control}
                label="Qtde. em Estoque"
                name="produto.quantidade"
                disabled={true}
                className="w-[10rem]"
              />

              <FormFieldInput
                trigger={form.trigger}
                control={form.control}
                label="Preço Venda"
                name="produto.precoVenda"
                disabled={true}
                className="w-[10rem]"
              />

              <InputMoney
                watch={form.watch}
                control={form.control}
                nameValor="produto.custoMedio"
                labelName="Custo Médio"
                disabled={true}
                className="w-[10rem]"
              />
            </div>
            <div className="flex flex-row gap-4">
              <FormFieldInput
                trigger={form.trigger}
                label="Quantidade*"
                name="quantidade"
                control={form.control}
                disabled={form.watch("idProduto") === 0 ? true : false}
                isNumber={true}
                errorMessage={form.formState.errors.quantidade?.message}
                className="col-span-3"
              />

              <InputMoney
                control={form.control}
                watch={form.watch}
                labelName="Preço Unitário*"
                nameValor="precoUnit"
                disabled={form.watch("idProduto") === 0 || form.watch("quantidade") === 0 ? true : false}
                errorMessage={form.formState.errors.precoUnit?.message}
              />

              <InputMoney
                control={form.control}
                watch={form.watch}
                labelName="Desconto Unit."
                nameValor="desconto"
                disabled={form.watch("precoUnit") === 0 ? true : false}
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
  );
};

export default ProdutoVendaForm;
