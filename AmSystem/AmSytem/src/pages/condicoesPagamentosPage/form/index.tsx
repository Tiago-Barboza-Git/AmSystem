import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Trash2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { CondicaoPagamentoFormData, CondicaoPagamentoFormSchema, defaultValues } from "./schema";
import { useEffect, useState } from "react";
import { IFormaPagamento } from "@/interfaces/formaPagamento.interfaces";
import { PostCondicaoPagamento, PutCondicaoPagamento } from "../services/queries";
import { CurrencyInput } from "react-currency-mask";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Parcelas } from "@/pages/parcelas";
import { IParcela } from "@/interfaces/parcela.interfaces";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParcelaForm } from "@/pages/parcelas/form";
import { formatPercentage } from "@/functions/functions";
import { Toaster, toast } from "sonner";
import useConfirmClose from "@/hooks/confirmClose";
import AlertDialogConfirm from "@/components/form/alertDialogConfirm";
import { H3, H4 } from "@/components/typography";

interface condicaoPaamentoFormProps {
  action: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  condicaoPagamento: ICondicaoPagamento | null;
  setCondicaoPagamento?: (condicaoPagamento: ICondicaoPagamento) => void;
}

const CondicaoPagamentoForm = ({
  action,
  isOpen,
  onOpenChange,
  condicaoPagamento,
  setCondicaoPagamento,
}: condicaoPaamentoFormProps) => {
  const [disabled, setDisabled] = useState<boolean>();
  const [openParcelasForm, setOpenParcelasForm] = useState<boolean>(false);
  const [parcelasData, setParcelasData] = useState<IParcela[] | undefined>(condicaoPagamento?.parcelas || []);
  const [formaPagamento, setFormaPagamento] = useState<IFormaPagamento | undefined>();

  const putCondicaoPagamento = PutCondicaoPagamento(onOpenChange);
  const postCondicaoPagamento = PostCondicaoPagamento(onOpenChange);
  const form = useForm<CondicaoPagamentoFormData>({
    mode: "onChange",
    resolver: zodResolver(CondicaoPagamentoFormSchema),
    defaultValues: defaultValues,
  });

  const { showAlert, setShowAlert, handleCloseDialog, handleConfirmClose } = useConfirmClose(
    form,
    action,
    onOpenChange,
  );

  const handleAddParcela = (newParcela: IParcela) => {
    const updatedParcelas = [...(parcelasData || []), newParcela];
    setParcelasData(updatedParcelas);
    form.setValue("parcelas", updatedParcelas);
    console.log(form.watch("parcelas"));
    console.log(form.watch("parcelas").reduce((sum, value) => Number(sum) + Number(value), 0) as number);
  };

  const handleRemoveParcela = (index: number) => {
    const updatedParcelas = [...form.getValues("parcelas")];
    updatedParcelas.splice(index, 1);
    setParcelasData(updatedParcelas);
    form.setValue("parcelas", updatedParcelas);
  };

  useEffect(() => {
    setParcelasData([]);
    if (action === "Edit" || action === "View") {
      action === "View" ? setDisabled(true) : setDisabled(false);
      form.reset({
        ...condicaoPagamento,
        desconto: parseFloat(String(condicaoPagamento?.desconto ?? "0")).toFixed(2),
        multa: parseFloat(String(condicaoPagamento?.multa ?? "0")).toFixed(2),
        juros: parseFloat(String(condicaoPagamento?.juros ?? "0")).toFixed(2),
        // parcelas: condicaoPagamento?.parcelas,
      });
      setParcelasData(condicaoPagamento?.parcelas);
    } else {
      setDisabled(false);
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const onSubmit = (data: ICondicaoPagamento) => {
    if (openParcelasForm === false) {
      console.log(form.watch("parcelas"));
      const sumParcelas = Number(
        form
          .watch("parcelas")
          .reduce((total, value) => total + Number(value.porcentagem), 0)
          .toFixed(2),
      );
      if (sumParcelas !== 100) {
        toast.error("A porcentagem da(s) parcela(s) deve(m) ser equivalente a 100%.");
      } else {
        if (action === "Edit") {
          putCondicaoPagamento.mutate(data);
        } else {
          postCondicaoPagamento.mutate(data);
        }
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-screen-lg max-h-[80%] overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <H3 className="text-center">
                {action === "Edit"
                  ? "Atualizar a condição de pagamento"
                  : action === "Add"
                    ? "Adicionar nova condição de pagamento"
                    : "Visualizar condição de pagamento"}
              </H3>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between col-span-9">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Cód."
                    name="id"
                    control={form.control}
                    errorMessage={form.formState.errors.id?.message}
                    isNumber={true}
                    disabled={true}
                    className="col-span-2"
                  />

                  <FormField
                    name="ativo"
                    control={form.control}
                    defaultValue={condicaoPagamento?.ativo}
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-col gap-2 items-center justify-center ${action === "Add" ? "hidden" : "visible"} `}
                      >
                        <FormLabel>Ativo</FormLabel>
                        <FormControl>
                          <Switch
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={setCondicaoPagamento ? true : disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-9 gap-4">
                  <FormFieldInput
                    trigger={form.trigger}
                    label="Condição de Pagamento*"
                    name="condicaoPagamento"
                    control={form.control}
                    disabled={disabled}
                    errorMessage={form.formState.errors.condicaoPagamento?.message}
                    className="col-span-4"
                    maxLength={50}
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    control={form.control}
                    label="Desconto (%)"
                    name="desconto"
                    maskFunction={formatPercentage}
                    disabled={disabled}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    control={form.control}
                    label="Juros (%)"
                    name="juros"
                    maskFunction={formatPercentage}
                    disabled={disabled}
                    className="col-span-2"
                  />

                  <FormFieldInput
                    trigger={form.trigger}
                    control={form.control}
                    label="Multa (%)"
                    name="multa"
                    maskFunction={formatPercentage}
                    disabled={disabled}
                    className="col-span-2"
                  />
                </div>
                <Separator className="!mt-10 !mb-9" />
                <div>
                  <H4 className="flex flex-col items-center">Parcelas</H4>
                  <div>
                    <Button
                      type="button"
                      onClick={() => setOpenParcelasForm(!openParcelasForm)}
                      className={`${disabled ? "hidden" : "visible"}`}
                    >
                      Adicionar
                    </Button>
                    <ParcelaForm
                      isOpen={openParcelasForm}
                      onOpenChange={(value) => setOpenParcelasForm(value)}
                      parcelasData={parcelasData ? parcelasData : []}
                      addParcela={handleAddParcela}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Núm. Parcela</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead>Porcentagem</TableHead>
                        <TableHead>Forma de Pagamento</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelasData?.map((parcela, index) => (
                        <TableRow key={parcela.numParcela}>
                          <TableCell className="font-medium">{parcela.numParcela}</TableCell>
                          <TableCell>{parcela.dias}</TableCell>
                          <TableCell>{parcela.porcentagem}</TableCell>
                          <TableCell>{parcela?.formaPagamento?.formaPagamento}</TableCell>
                          <TableCell>
                            <button disabled={disabled} onClick={() => handleRemoveParcela(index)}>
                              <Trash2 color="red" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5}>
                          Total Porcentagem ={" "}
                          {(form.watch("parcelas") || [])
                            .reduce((sum, value) => Number(sum) + Number(value.porcentagem), 0)
                            .toFixed(2)}
                          %
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                <Separator className="!mt-10 !mb-9" />
                <div className="flex flex-row gap-4 !m-0">
                  <InputCalendar
                    label="Dt. Cadastro"
                    name="dtCadastro"
                    control={form.control}
                    setValue={form.setValue}
                    value={form.watch("dtCadastro")}
                    disabled={true}
                    className="flex flex-col"
                  />

                  <InputCalendar
                    label="Dt. Alteração"
                    name="dtAlteracao"
                    control={form.control}
                    setValue={form.setValue}
                    value={form.watch("dtAlteracao")}
                    disabled={true}
                    className="flex flex-col"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="destructive"
                    className={`${action === "View" ? "hidden" : "visible"}  w-[10rem]`}
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className={`${action === "View" ? "hidden" : "visible"} bg-[#4A90E2] w-[10rem] hover:bg-[#2b5c95]`}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <AlertDialogConfirm open={showAlert} onConfirm={handleConfirmClose} onCancel={() => setShowAlert(false)} />
    </>
  );
};

export default CondicaoPagamentoForm;
