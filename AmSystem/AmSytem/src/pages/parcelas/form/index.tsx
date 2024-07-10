import FormFieldInput from "@/components/form/input";
import { Separator } from "@/components/ui/separator";
import { IParcela } from "@/interfaces/parcela.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ParcelaFormData, ParcelaFormSchema, defaultValues } from "./schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { Search } from "lucide-react";
import { PaisesPage } from "@/pages/paisesPage";
import { FormasPagamentosPage } from "@/pages/formasPagamentosPage";
import { formatPercentage, definirProximaParcela } from "@/functions/functions";

interface ParcelaFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  parcelasData: IParcela[];
  addParcela: (parcela: IParcela) => void;
}

export const ParcelaForm = ({
  isOpen,
  onOpenChange,
  parcelasData,
  addParcela,
}: ParcelaFormProps) => {
  const [openFormaPagamento, setOpenFormaPagamento] = useState<boolean>(false);
  const [formaPagamento, setFormaPagamento] = useState<IFormaPagamento | null>(
    null
  );
  const form = useForm<ParcelaFormData>({
    mode: "onChange",
    resolver: zodResolver(ParcelaFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    form.setValue("numParcela", definirProximaParcela(parcelasData));
  }, [isOpen]);

  useEffect(() => {
    form.setValue("idFormaPagamento", formaPagamento?.id as number);
    form.setValue("formaPagamento", formaPagamento as IFormaPagamento);
    setOpenFormaPagamento(false);
  }, [formaPagamento]);

  const onSubmit = (data: IParcela) => {
    console.log("Teste");
    addParcela(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-screen-md max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Adicionar nova parcela"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between col-span-9">
                <FormFieldInput
                  label="Cód."
                  name="id"
                  control={form.control}
                  errorMessage={form.formState.errors.id?.message}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2"
                />
              </div>
              <Separator className="!mt-10 !mb-9" />
              <div className="grid grid-cols-8 grid-rows-2 gap-4">
                <FormFieldInput
                  label="Núm. Parcela"
                  name="numParcela"
                  control={form.control}
                  isNumber={true}
                  errorMessage={form.formState.errors.numParcela?.message}
                  className="col-span-2"
                />

                <FormFieldInput
                  label="Dias"
                  name="dias"
                  control={form.control}
                  isNumber={true}
                  errorMessage={form.formState.errors.dias?.message}
                  className="col-span-1"
                />

                <FormFieldInput
                  label="Porcentagem"
                  name="porcentagem"
                  control={form.control}
                  maskFunction={formatPercentage}
                  errorMessage={form.formState.errors.porcentagem?.message}
                  className="col-span-1"
                />

                <FormFieldInput
                  label="Cód. Forma Pagamento"
                  name="idFormaPagamento"
                  control={form.control}
                  isNumber={true}
                  disabled={true}
                  className="col-span-2 row-start-2"
                />

                <FormFieldInput
                  label="Forma de Pagamento"
                  name="formaPagamento.formaPagamento"
                  control={form.control}
                  disabled={true}
                  className="col-span-3 row-start-2"
                />

                <div className="relative row-start-2">
                  <Dialog
                    open={openFormaPagamento}
                    onOpenChange={(value) => setOpenFormaPagamento(value)}
                  >
                    <DialogTrigger asChild className="absolute bottom-[30%]">
                      <Button variant="default">
                        <Search />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="!p-0">
                      <FormasPagamentosPage
                        setFormaPagamento={setFormaPagamento}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
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
