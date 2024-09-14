import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IContaPagar } from "@/interfaces/contasPagar";
import { FormProvider, useForm } from "react-hook-form";
import { ContaPagarFormData, ContaPagarFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldInput from "@/components/form/input";
import SearchItem from "@/components/searchItem";
import InputCalendar from "@/components/form/inputCalendar";
import { useState } from "react";

interface ContasPagarFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  contaPagar: IContaPagar | null;
}

function ContaPagarForm({ isOpen, onOpenChange, contaPagar }: ContasPagarFormProps) {
  const [disabled, setDisabled] = useState<boolean>(false);

  const form = useForm<ContaPagarFormData>({
    mode: "onChange",
    resolver: zodResolver(ContaPagarFormSchema),
  });

  const onSubmit = () => {};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen-md max-h-[80%] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{contaPagar ? "Visualizar conta a pagar" : "Realizar o pagamento"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldInput
              label="Nr. Nota*"
              name="nrNota"
              control={form.control}
              isNumber={true}
              disabled={disabled}
              className="col-span-2"
            />

            <FormFieldInput
              label="Nr. Modelo*"
              name="nrModelo"
              control={form.control}
              disabled={disabled}
              isNumber={true}
              className="col-span-2"
            />

            <FormFieldInput
              label="Nr. Série*"
              name="nrSerie"
              control={form.control}
              isNumber={true}
              disabled={disabled}
              className="col-span-2"
            />

            <div className="col-span-6">
              <SearchItem
                control={form.control}
                getValue={form.getValues}
                setValue={form.setValue}
                watch={form.watch}
                labelCod="Cód. Fornecedor"
                nameCod="idFornecedor"
                labelNome="Fornecedor*"
                nameNome="fornecedor.pessoaRazaoSocial"
                disabled={disabled}
                className="flex flex-row gap-4 flex-grow"
              />
            </div>

            <div className="row-start-2 row-end-2 col-span-4">
              <InputCalendar
                control={form.control}
                name="dtEmissao"
                label="Dt. Emissão"
                value={form.watch("dtEmissao")}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Button variant="default" onClick={() => onSubmit}>
                Salvar
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ContaPagarForm;
