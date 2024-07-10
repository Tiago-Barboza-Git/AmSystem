import React from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
  useController,
  useWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input"; // Ajuste o caminho conforme necessário
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"; // Ajuste o caminho conforme necessário
import { error } from "console";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "../../calendar";
import { cn } from "@/lib/utils";

export interface InputCalendarProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  msg?: string;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  value?: any;
  setValue: UseFormSetValue<T>;
}

const InputCalendar = <T extends FieldValues>({
  name,
  control,
  label,
  msg,
  className = "",
  errorMessage,
  disabled = false,
  value,
  setValue,
  ...rest
}: InputCalendarProps<T>) => {
  const {
    formState,
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  const data = value ? value : undefined;

  const hasError = errorMessage ? errorMessage?.length > 0 : false;

  return (
    <FormItem className={`${className}`}>
      <FormLabel className={`${hasError ? "text-red-500" : ""}`}>
        {label}
      </FormLabel>
      <FormControl className="flex flex-col gap-[1.12rem] !m-0">
        <Popover>
          <PopoverTrigger asChild className="flex">
            <Button
              variant={"outline"}
              className={cn(
                "w-[190px] justify-start text-left font-normal",
                !data && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data ? (
                format(data, "PPP", { locale: ptBR })
              ) : (
                <span>{msg ? msg : "Insira a Data"}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className=" w-auto p-0">
            <Calendar
              disabled={disabled === true ? true : false}
              mode="single"
              captionLayout="dropdown-buttons"
              selected={data}
              onSelect={(date) => setValue(name, date as PathValue<T, Path<T>>)}
              fromYear={1960}
              toYear={2030}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      {/* {hasError && <FormMessage>{errorMessage}</FormMessage>} */}
      {invalid && error && (
        <FormMessage className="text-red-500">{error.message}</FormMessage>
      )}
    </FormItem>
  );
};

export default InputCalendar;
