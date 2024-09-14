import DataTable from "@/components/datatable";
import { IProdutoCompra } from "@/interfaces/produtoCompra.interfaces";
import { useCallback, useMemo, useState } from "react";
import { getProdutosCompraColumns } from "./columns";
import ProdutoCompraForm from "@/pages/comprasPage/produtosCompra/form";
import DeleteDialog2 from "@/components/dialog/deleteDialog2";
import { Separator } from "@/components/ui/separator";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompraFormData } from "../../schema";
import { formatCurrency } from "@/functions/masks";
import { formatMoney } from "@/functions/functions";

interface produtosCompraPartProps {
  getValue: UseFormGetValues<CompraFormData>;
  setValue: UseFormSetValue<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  disabled: boolean;
  actionPai: string;
}

function ProdutosCompraPart({ getValue, setValue, watch, disabled, actionPai }: produtosCompraPartProps) {
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
    const updateProdutosCompra = [...(getValue("produtos") || []), produtoCompra];
    setValue("produtos", updateProdutosCompra);
    setValue(
      "totalProdutos",
      watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
    );
    setValue("totalCompra", formatMoney(watch("totalProdutos") as string) + formatMoney(watch("totalCusto") as string));
    console.log(watch("totalCompra"));
    setOpenProdutosCompraForm(false);
  };

  const handleEditProdutoCompra = (produtoCompra: IProdutoCompra) => {
    const updateProdutosCompra = getValue("produtos").map((produto) =>
      produto.produto.id === produtoCompra.produto.id ? produtoCompra : produto,
    );
    setValue("produtos", updateProdutosCompra);
    setValue(
      "totalProdutos",
      watch("produtos").reduce((value, sum) => value + Number(Number(sum.precoTotal).toFixed(2)), 0 as number),
    );
    setValue("totalCompra", formatMoney(watch("totalProdutos") as string) + formatMoney(watch("totalCusto") as string));
    setOpenProdutosCompraForm(false);
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
      setValue(
        "totalCompra",
        formatMoney(watch("totalProdutos") as string) + formatMoney(watch("totalCusto") as string),
      );
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
          columns={useMemo(() => getProdutosCompraColumns({ onEdit, onDelete, action }), [])}
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
