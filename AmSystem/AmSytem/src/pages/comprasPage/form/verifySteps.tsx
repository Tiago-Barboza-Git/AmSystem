import { FormState, UseFormGetValues, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { CompraFormData } from "./schema";
import { formatMoney } from "@/functions/functions";
import { toast } from "sonner";
import { GetVerificaExistenciaCompra } from "../services/queries";
import { useQuery } from "react-query";
import { useState } from "react";
import { GetVerificaExistenciaCompraRequest, getExistenciaCompra } from "../services/api";

interface verifyStepsProps {
  setValue: UseFormSetValue<CompraFormData>;
  getValues: UseFormGetValues<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  trigger: UseFormTrigger<CompraFormData>;
  activeStep: number;
  setActiveStep: (value: number) => void;
  setDisabled: (value: boolean) => void;
}

export async function nextStep({
  setValue,
  getValues,
  watch,
  trigger,
  activeStep,
  setActiveStep,
  setDisabled,
}: verifyStepsProps) {
  const [existCompra, setExistCompra] = useState<boolean>(false);

  if (activeStep === 0) {
  }

  // if (activeStep === 0) {
  //   if ((await trigger(["nrNota", "nrModelo", "nrSerie", "idFornecedor"])) === false)
  //     toast.error("Os campos apresetandos possuem erros.");
  //   if (existCompra === true) toast.error("Já existe uma compra com esses dados.");
  //   // else setActiveStep(activeStep + 1);
  // } else if (activeStep === 1) {
  //   if (watch("produtos") !== undefined && watch("produtos").length > 0) {
  //     setValue(
  //       "totalProdutos",
  //       getValues("produtos").reduce(
  //         (sum, item) => (sum + formatMoney(item.precoTotal as string)) as number,
  //         0,
  //       ) as number,
  //     );
  //     setActiveStep(activeStep + 1);
  //   } else {
  //     toast.error("É necessário que a compra tenha ao menos um produto!!!");
  //   }
  // } else if (activeStep === 2) {
  //   // form.clearErrors(["condicaoPagamento.condicaoPagamento", "idCondicaoPagamento"]);
  //   setActiveStep(activeStep + 1);
  // } else if (activeStep === 3) {
  //   if (watch("idCondicaoPagamento") !== 0) {
  //     setDisabled(true);
  //     setActiveStep(activeStep + 1);
  //   }
  // }
}

// export function lastStep({ setValue, getValues, watch, activeStep, setActiveStep, setDisabled }: verifyStepsProps) {
//   if (activeStep !== 0) {
//     if (activeStep === 4) {
//       setDisabled(false);
//     }
//     setActiveStep(activeStep - 1);
//   }
// }

// nextStep({
//   setValue: form.setValue,
//   getValues: form.getValues,
//   watch: form.watch,
//   trigger: form.trigger,
//   activeStep,
//   setActiveStep,
//   setDisabled,
// });
