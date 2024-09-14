import { Label } from "@/components/text/text";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CurrencyInput from "react-currency-input-field";
import { Control, FieldValues, Path, UseFormWatch } from "react-hook-form";

interface InputMoneyProps<T extends FieldValues> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  errorMessage?: string;
  labelName: string;
  nameValor: Path<T>;
  disabled?: boolean;
}

function InputMoney<T extends FieldValues>({
  control,
  watch,
  errorMessage,
  labelName,
  nameValor,
  disabled = false,
}: InputMoneyProps<T>) {
  return (
    <FormField
      control={control}
      name={nameValor}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2 col-span-2 row-start-2 row-end-2">
          <FormLabel>
            <Label>{labelName}</Label>
          </FormLabel>
          <FormControl>
            <CurrencyInput
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              prefix="R$ "
              decimalScale={2}
              allowDecimals={true}
              allowNegativeValue={false}
              disabled={disabled}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              value={watch(nameValor)}
            />
          </FormControl>
          <FormMessage>{errorMessage}</FormMessage>
        </FormItem>
      )}
    />
  );
}

export default InputMoney;
