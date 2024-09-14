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
import { formatPercentage } from "@/functions/functions";
import { Toaster, toast } from "sonner";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { ProdutoCompraFormData, ProdutoCompraFormSchema, defaultValues } from "./schema";
import { IProduto } from "@/interfaces/produto.interfaces";
import { ProdutosPage } from "@/pages/produtosPage";
import { formatCurrency } from "@/functions/masks";
import { CompraFormData } from "../form/schema";
import SearchItem from "@/components/searchItem";

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
}: produtoCompraFormProps) => {
  const [openProdutos, setOpenProdutos] = useState<boolean>(false);
  const [produto, setProduto] = useState<IProduto | undefined>(produtoCompra?.produto);

  const form = useForm<ProdutoCompraFormData>({
    mode: "onChange",
    resolver: zodResolver(ProdutoCompraFormSchema),
    defaultValues: defaultValues,
  });

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
    form.setValue("idProduto", produto?.id as number);
    form.setValue("produto", produto as IProduto);
    setOpenProdutos(false);
  }, [produto]);

  const onSubmit = (data: IProdutoCompra) => {
    data.precoUnit = formatCurrency(data.precoUnit as string);
    if (action === "Add") {
      data.precoTotal = data.precoUnit * data.quantidade;
      handleAddProdutoCompra(data);
      toast.success("Produto adicionado com sucesso a compra.");
    } else {
      data.precoTotal = data.precoUnit * data.quantidade;
      handleEditProdutoCompra(data);
      toast.success("Produto alterado com sucesso na compra.");
    }
  };

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
            <div className="grid grid-cols-6 gap-4">
              <FormFieldInput
                label="Cód. Produto"
                name="idProduto"
                control={form.control}
                isNumber={true}
                disabled={true}
                className="col-span-1"
              />

              <FormFieldInput
                label="Produto"
                name="produto.produto"
                control={form.control}
                disabled={true}
                className="col-span-3"
              />

              <div className="relative col-span-1">
                <Dialog open={openProdutos} onOpenChange={(value) => setOpenProdutos(value)}>
                  <DialogTrigger asChild className="relative mt-[31%]">
                    <Button variant="default">
                      <Search />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!p-0 max-w-2xl">
                    <ProdutosPage setProduto={setProduto} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <FormFieldInput
                label="Quantidade"
                name="quantidade"
                control={form.control}
                disabled={false}
                isNumber={true}
                className="col-span-3"
              />

              <FormField
                name="precoUnit"
                control={form.control}
                defaultValue={produtoCompra?.precoUnit}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 col-span-1">
                    <FormLabel>Preço Unitário</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        defaultValue={field.value}
                        onChangeValue={field.onChange}
                        currency="BRL"
                        locale="pt-BR"
                        InputElement={<Input defaultValue={field.value} />}
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.quantidade?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button type="submit" variant="default" onClick={() => onsubmit}>
                Salvar
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoCompraForm;
