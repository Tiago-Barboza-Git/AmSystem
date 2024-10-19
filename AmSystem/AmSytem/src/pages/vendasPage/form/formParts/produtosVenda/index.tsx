import DataTable from "@/components/datatable";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProdutosVendaColumns } from "./columns";
import DeleteDialog2 from "@/components/dialog/deleteDialog";
import { Separator } from "@/components/ui/separator";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VendaFormData } from "../../schema";
import { formatCurrency } from "@/functions/masks";
import { formatMoney } from "@/functions/functions";
import { initialCondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { IProdutoVenda } from "@/interfaces/Venda/produtoVenda.interfaces";
import ProdutoVendaForm from "@/pages/vendasPage/produtosVenda/form";

interface produtosVendaPartProps {
  getValue: UseFormGetValues<VendaFormData>;
  setValue: UseFormSetValue<VendaFormData>;
  watch: UseFormWatch<VendaFormData>;
  disabled: boolean;
  actionPai: string;
  activedStep: number;
}

function ProdutosVendaPart({ getValue, setValue, watch, disabled, actionPai, activedStep }: produtosVendaPartProps) {
  // Form
  const [action, setAction] = useState<string>("");
  const [index, setIndex] = useState<number>(-1);
  const [selectedProdutoVenda, setSelectedProdutoVenda] = useState<IProdutoVenda | null>(null);
  const [openProdutosVendaForm, setOpenProdutosVendaForm] = useState<boolean>(false);
  // Form

  // Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // Delete Dialog

  const onAdd = useCallback(() => {
    setAction("Add");
    setSelectedProdutoVenda(null);
    setOpenProdutosVendaForm(true);
  }, []);

  const onEdit = useCallback((produtoVenda: IProdutoVenda) => {
    setAction("Edit");
    setSelectedProdutoVenda(produtoVenda);
    setOpenProdutosVendaForm(true);
  }, []);

  const onDelete = useCallback((produtoVenda: IProdutoVenda, index: number) => {
    setIndex(index);
    setSelectedProdutoVenda(produtoVenda);
    setOpenDeleteDialog(true);
    // setValue("totalProdutos", ((getValue("totalProdutos") as number) - Number(produtoCompra.precoTotal)) as number);
  }, []);

  const handleAddProdutoVenda = (produtoVenda: IProdutoVenda) => {
    const updateProdutosCompra = [...(getValue("produtos") || []), produtoVenda];
    setValue("produtos", updateProdutosCompra);
    console.log(watch("produtos"));
    setValue(
      "totalProdutos",
      watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
    );
    setValue("totalNota", watch("totalProdutos"));
    setValue("idCondicaoPagamento", 0);
    setValue("condicaoPagamento", initialCondicaoPagamento);
    setValue("contasReceber", []);
    setOpenProdutosVendaForm(false);
  };

  const handleEditProdutoVenda = (produtoVenda: IProdutoVenda) => {
    const updateProdutosVenda = getValue("produtos").map((produto) =>
      produto?.produto?.id === produtoVenda?.produto?.id ? produtoVenda : produto,
    );
    setValue("produtos", updateProdutosVenda);
    setValue(
      "totalProdutos",
      watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
    );
    setValue("totalNota", formatMoney(String(watch("totalProdutos"))));
    setValue("idCondicaoPagamento", 0);
    setValue("condicaoPagamento", initialCondicaoPagamento);
    setValue("contasReceber", []);
    setOpenProdutosVendaForm(false);
  };

  const handleRemoveProdutoVenda = (confirmed: boolean) => {
    if (confirmed) {
      const updateProdutosCompra = [...getValue("produtos")];
      updateProdutosCompra.splice(index, 1);
      setValue("produtos", updateProdutosCompra);
      setValue(
        "totalProdutos",
        watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
      );
      setValue("totalNota", formatMoney(String(watch("totalProdutos"))));
      setValue("idCondicaoPagamento", 0);
      setValue("condicaoPagamento", initialCondicaoPagamento);
      setValue("contasReceber", []);
    }
  };

  return (
    <div>
      <div>
        <ProdutoVendaForm
          action={action}
          isOpen={openProdutosVendaForm}
          onOpenChange={(value) => setOpenProdutosVendaForm(value)}
          handleAddProdutoVenda={handleAddProdutoVenda}
          handleEditProdutoVenda={handleEditProdutoVenda}
          produtoVenda={selectedProdutoVenda}
          watch={watch}
          setValue={setValue}
          getValue={getValue}
        />
        <DeleteDialog2
          isOpen={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onConfirm={handleRemoveProdutoVenda}
        />
      </div>
      <div>
        <DataTable
          columns={useMemo(() => getProdutosVendaColumns({ onEdit, onDelete, actionPai, activedStep }), [activedStep])}
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

export default ProdutosVendaPart;
