import DataTable from "@/components/datatable";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProdutosCompraColumns } from "./columns";
import ProdutoCompraForm from "@/pages/comprasPage/produtosCompra/form";
import DeleteDialog2 from "@/components/dialog/deleteDialog2";
import { Separator } from "@/components/ui/separator";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompraFormData } from "../../schema";
import { formatCurrency } from "@/functions/masks";
import { formatMoney } from "@/functions/functions";
import { initialCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { toast } from "sonner";

interface produtosCompraPartProps {
  getValue: UseFormGetValues<CompraFormData>;
  setValue: UseFormSetValue<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  disabled: boolean;
  actionPai: string;
  activedStep: number;
}

function ProdutosCompraPart({ getValue, setValue, watch, disabled, actionPai, activedStep }: produtosCompraPartProps) {
  // Form
  const [action, setAction] = useState<string>("");
  const [index, setIndex] = useState<number>(-1);
  const [selectedProdutoCompra, setSelectedProdutoCompra] = useState<IProdutoCompra | null>(null);
  const [openProdutosCompraForm, setOpenProdutosCompraForm] = useState<boolean>(false);
  // Form

  // Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // Delete Dialog

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedProdutoCompra(null);
    setOpenProdutosCompraForm(true);
  }, []);

  const onEdit = useCallback((produtoCompra: IProdutoCompra) => {
    setAction("Edit");
    setSelectedProdutoCompra(produtoCompra);
    setOpenProdutosCompraForm(true);
  }, []);

  const onDelete = useCallback((produtoCompra: IProdutoCompra, index: number) => {
    setIndex(index);
    setSelectedProdutoCompra(produtoCompra);
    setOpenDeleteDialog(true);
    // setValue("totalProdutos", ((getValue("totalProdutos") as number) - Number(produtoCompra.precoTotal)) as number);
  }, []);

  const handleAddProdutoCompra = (produtoCompra: IProdutoCompra) => {
    if (watch("produtos").find((x) => x.idProduto == produtoCompra.idProduto) == undefined) {
      const updateProdutosCompra = [...(getValue("produtos") || []), produtoCompra];
      setValue("produtos", updateProdutosCompra);
      setValue(
        "totalProdutos",
        watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
      );
      setValue("totalNota", watch("totalProdutos") + watch("totalCusto"));
      setValue("idCondicaoPagamento", 0);
      setValue("condicaoPagamento", initialCondicaoPagamento);
      setValue("contasPagar", []);
      setOpenProdutosCompraForm(false);
      toast.success("Produto adicionado com sucesso a compra.");
    } else {
      toast.error("Esse produto já se encontra na compra!");
    }
  };

  const handleEditProdutoCompra = (produtoCompra: IProdutoCompra) => {
    const updateProdutosCompra = getValue("produtos").map((produto) =>
      produto?.produto?.id === produtoCompra?.produto?.id ? produtoCompra : produto,
    );
    setValue("produtos", updateProdutosCompra);
    setValue(
      "totalProdutos",
      watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
    );
    setValue("totalNota", formatMoney(String(watch("totalProdutos"))) + formatMoney(String(watch("totalCusto"))));
    setValue("idCondicaoPagamento", 0);
    setValue("condicaoPagamento", initialCondicaoPagamento);
    setValue("contasPagar", []);
    setOpenProdutosCompraForm(false);
    toast.success("Produto alterado com sucesso na compra.");
  };

  const handleRemoveProdutoCompra = (confirmed: boolean) => {
    if (confirmed) {
      const updateProdutosCompra = [...getValue("produtos")];
      updateProdutosCompra.splice(index, 1);
      setValue("produtos", updateProdutosCompra);
      setValue(
        "totalProdutos",
        watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
      );
      setValue("totalNota", formatMoney(String(watch("totalProdutos"))) + formatMoney(String(watch("totalCusto"))));
      setValue("idCondicaoPagamento", 0);
      setValue("condicaoPagamento", initialCondicaoPagamento);
      setValue("contasPagar", []);
    }
  };

  return (
    <div>
      <div>
        <ProdutoCompraForm
          action={action}
          isOpen={openProdutosCompraForm}
          onOpenChange={(value) => setOpenProdutosCompraForm(value)}
          handleAddProdutoCompra={handleAddProdutoCompra}
          handleEditProdutoCompra={handleEditProdutoCompra}
          produtoCompra={selectedProdutoCompra}
          watch={watch}
          setValue={setValue}
          getValue={getValue}
        />
        <DeleteDialog2
          isOpen={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onConfirm={handleRemoveProdutoCompra}
        />
      </div>
      <div>
        <DataTable
          columns={useMemo(() => getProdutosCompraColumns({ onDelete, actionPai, activedStep }), [activedStep])}
          data={watch("produtos")}
          onAdd={onAdd}
          ativos={undefined}
          hidden={disabled}
        />
        <Separator className="w-[300px] !mt-5 !mb-5 !mr-auto !ml-auto" />
        <span>Total Produtos: R$ {watch("totalProdutos")}</span>
      </div>
    </div>
  );
}

export default ProdutosCompraPart;
