import FormFieldInput from "@/components/form/input";
import InputCalendar from "@/components/form/inputCalendar";
import SearchItem from "@/components/searchItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ICompra } from "@/interfaces/compra.interfaces";
import { IFornecedor, IFornecedorRef } from "@/interfaces/fornecedor.interfaces";
import { CompraFormData } from "@/pages/comprasPage/form/schema";
import { FornecedoresPage } from "@/pages/fornecedoresPage";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface dadosNotaPartProps {
  control: Control<CompraFormData>;
  setValue: UseFormSetValue<CompraFormData>;
  getValue: UseFormGetValues<CompraFormData>;
  watch: UseFormWatch<CompraFormData>;
  errors: FieldErrors<CompraFormData>;
  compra: ICompra;
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
  compra,
  action,
  disabled,
  activeStep,
}: dadosNotaPartProps) {
  const [openFornecedores, setOpenFornecedores] = useState<boolean>(false);
  const [fornecedor, setFornecedor] = useState<IFornecedorRef | undefined>(compra?.fornecedor);

  useEffect(() => {
    setValue("idFornecedor", fornecedor?.id as number);
    setValue("fornecedor", fornecedor as IFornecedor);
    setOpenFornecedores(false);
  }, [fornecedor]);

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
          obj={fornecedor}
          setObj={setFornecedor}
          openSearch={openFornecedores}
          setOpenSearch={setOpenFornecedores}
          labelCod="Cód. Fornecedor"
          nameCod="idFornecedor"
          labelNome="Fornecedor*"
          nameNome="fornecedor.pessoaRazaoSocial"
          errorMessage={errors?.idFornecedor?.message}
          disabled={disabled}
          page={<FornecedoresPage setFornecedor={setFornecedor} />}
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

      <div className="row-start-2 row-end-2 col-span-4">
        <InputCalendar
          control={control}
          name="dtChegada"
          label="Dt. Chegada"
          setValue={setValue}
          value={watch("dtChegada")}
          disabled={disabled}
          errorMessage={errors?.dtChegada?.message}
        />
      </div>
    </div>
  );
}

export default DadosNotaPart;
