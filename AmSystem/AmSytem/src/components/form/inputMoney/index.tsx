import { Label } from "@/components/text/text";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CurrencyInput from "react-currency-input-field";
import { Control, FieldValues, Path, UseFormWatch, useController } from "react-hook-form";

interface InputMoneyProps<T extends FieldValues> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  errorMessage?: string;
  labelName: string;
  nameValor: Path<T>;
  disabled?: boolean;
  className?: string;
}

function InputMoney<T extends FieldValues>({
  control,
  watch,
  errorMessage,
  labelName,
  nameValor,
  disabled = false,
  className,
}: InputMoneyProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name: nameValor,
    control,
  });

  const hasError = errorMessage ? errorMessage?.length > 0 : false;

  // Função para controlar a entrada do usuário e permitir apenas números e vírgulas
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir apenas números, vírgula, backspace, delete e teclas de navegação
    const allowedKeys = [
      "Backspace", // Tecla apagar à esquerda
      "Delete", // Tecla apagar à direita
      "ArrowLeft", // Tecla de seta para a esquerda
      "ArrowRight", // Tecla de seta para a direita
      "Tab", // Tecla Tab
      "Home", // Tecla Home
      "End", // Tecla End
      ",", // Permitir a vírgula como separador decimal
    ];

    // Verifica se a tecla pressionada não é um número ou uma das teclas permitidas
    if (
      !allowedKeys.includes(event.key) && // Não é uma tecla permitida
      !(event.key >= "0" && event.key <= "9") // Não é um número de 0 a 9
    ) {
      // Bloquear a entrada de qualquer caractere não permitido
      event.preventDefault();
    }
  };

  return (
    <FormItem className={`${className}flex flex-col gap-2`}>
      <FormLabel>{labelName}</FormLabel>
      <FormControl>
        <CurrencyInput
          className={`${hasError ? "border-red-500" : ""} flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
          prefix="R$ "
          // fixedDecimalLength={2}
          decimalScale={2}
          onBlur={() => {
            // Forçar a validação no evento onBlur
            field.onBlur();
            field.onChange(field.value);
          }}
          ref={field.ref}
          allowDecimals={true}
          allowNegativeValue={false}
          disabled={disabled}
          // onChange={(value) => {
          //   field.onChange(String(value.target.value));
          // }}
          onValueChange={(value) => {
            field.onChange(value);
          }}
          onKeyDown={handleKeyDown}
          value={watch(nameValor) as string}
        />
      </FormControl>
      {invalid && error && <FormMessage className="text-red-500">{error.message}</FormMessage>}
    </FormItem>
  );
}

export default InputMoney;
