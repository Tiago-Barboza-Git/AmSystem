import { useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";

const useConfirmClose = (
  form: UseFormReturn<any>,
  action: string,
  onOpenChange: (value: boolean) => void,
  nameForm?: string,
) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  //   const form = useFormContext();

  const handleCloseDialog = () => {
    if (action !== "Add") {
      onOpenChange(false);
      return;
    }

    let filters;

    if (nameForm) {
      if (nameForm === "Compra") {
        filters = Object.entries(form.watch()).filter(
          ([key]) =>
            key !== "dtCadastro" &&
            key !== "dtAlteracao" &&
            key !== "ativo" &&
            key !== "tpFrete" &&
            key !== "dtEmissao" &&
            key !== "dtChegada" &&
            key !== "condicaoPagamento" &&
            key !== "fornecedor",
        );
      } else if (nameForm === "ProdutoCompra") {
        filters = Object.entries(form.watch()).filter(([key]) => key !== "produto");
      } else if (nameForm === "Parcelas") {
        filters = Object.entries(form.watch()).filter(([key]) => key !== "numParcela");
      } else if (nameForm === "FormVendas") {
        filters = Object.entries(form.watch()).filter(([key]) => key !== "nrNota");
      }
    } else {
      filters = Object.entries(form.watch()).filter(
        ([key]) => key !== "dtCadastro" && key !== "dtAlteracao" && key !== "ativo",
      );
    }
    // Verifica se há valores preenchidos, exceto os campos especificados.
    const haveValues = filters?.some(([, value]) => {
      // if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null) return Object.values(value).some((v) => !!v);
      return !!value;
    });

    if (haveValues) {
      // Se existem valores preenchidos, mostrar alerta.
      setShowAlert(true);
    } else {
      // Caso contrário, fecha diretamente o formulário.
      onOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    setShowAlert(false);
    onOpenChange(false);
  };

  return {
    showAlert,
    setShowAlert,
    handleCloseDialog,
    handleConfirmClose,
  };
};

export default useConfirmClose;
