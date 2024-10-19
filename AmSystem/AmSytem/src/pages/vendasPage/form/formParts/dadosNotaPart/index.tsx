import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import SearchItem from "@/components/searchItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { IVenda } from "@/interfaces/Venda/venda.interface";
import { IClienteRef } from "@/interfaces/cliente.interfaces";
import { ICompra } from "@/interfaces/compra.interfaces";
import { IFornecedor, IFornecedorRef } from "@/interfaces/fornecedor.interfaces";
import { ClientesPage } from "@/pages/clientesPage";
import { CompraFormData } from "@/pages/comprasPage/form/schema";
import { FornecedoresPage } from "@/pages/fornecedoresPage";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VendaFormData } from "../../schema";

interface dadosNotaPartProps {
  control: Control<VendaFormData>;
  setValue: UseFormSetValue<VendaFormData>;
  getValue: UseFormGetValues<VendaFormData>;
  watch: UseFormWatch<VendaFormData>;
  errors: FieldErrors<VendaFormData>;
  venda: IVenda;
  action?: string;
  disabled?: boolean;
  activeStep: number;
}

function DadosNotaPart({
  control,
  setValue,
  getValue,
  watch,
  errors,
  venda,
  action,
  disabled,
  activeStep,
}: dadosNotaPartProps) {
  const [openClientes, setOpenClientes] = useState<boolean>(false);
  const [cliente, setCliente] = useState<IClienteRef | undefined>(venda?.cliente);

  useEffect(() => {
    setValue("idCliente", cliente?.id as number);
    setValue("cliente", cliente as IClienteRef);
    setOpenClientes(false);
  }, [cliente]);

  return (
    <div className="grid grid-cols-12 grid-rows-2 gap-6">
      <FormFieldInput
        label="Nr. Nota*"
        name="nrNota"
        control={control}
        errorMessage={errors.nrNota?.message}
        isNumber={true}
        disabled={disabled}
        className="col-span-2"
      />

      <FormFieldInput
        label="Nr. Modelo*"
        name="nrModelo"
        control={control}
        errorMessage={errors.nrModelo?.message}
        disabled={disabled}
        isNumber={true}
        className="col-span-2"
      />

      <FormFieldInput
        label="Nr. Série*"
        name="nrSerie"
        control={control}
        errorMessage={errors.nrSerie?.message}
        isNumber={true}
        disabled={disabled}
        className="col-span-2"
      />

      <div className="col-span-6">
        <SearchItem
          control={control}
          getValue={getValue}
          setValue={setValue}
          watch={watch}
          obj={cliente}
          setObj={setCliente}
          openSearch={openClientes}
          setOpenSearch={setOpenClientes}
          labelCod="Cód. Cliente"
          nameCod="idCliente"
          labelNome="Cliente*"
          nameNome="cliente.pessoaRazaoSocial"
          errorMessage={errors?.idCliente?.message}
          disabled={disabled}
          page={<ClientesPage setCliente={setCliente} />}
          hiddenButton={action === "View" || disabled === true ? true : false}
          className="flex flex-row gap-4 flex-grow"
        />
      </div>

      <div className="row-start-2 row-end-2 col-span-4">
        <InputCalendar
          control={control}
          name="dtEmissao"
          label="Dt. Emissão"
          setValue={setValue}
          value={watch("dtEmissao")}
          disabled={disabled}
          errorMessage={errors?.dtEmissao?.message}
        />
      </div>
    </div>
  );
}

export default DadosNotaPart;
