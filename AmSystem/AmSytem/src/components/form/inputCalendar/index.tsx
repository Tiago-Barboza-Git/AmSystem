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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // Ajuste o caminho conforme necessário
import { error } from "console";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "../../calendar";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";

export interface InputCalendarProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label: string;
  msg?: string;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  value?: any;
  setValue?: UseFormSetValue<T>;
  fromDate?: Date;
  toDate?: Date;
}

const InputCalendar = <T extends FieldValues>({
  name,
  control,
  label,
  msg,
  className = "",
  errorMessage = "",
  disabled = false,
  value,
  setValue,
  fromDate,
  toDate,
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
        <Label>{label}</Label>
      </FormLabel>
      <FormControl className="flex flex-col gap-[1.12rem] !m-0">
        <Popover>
          <PopoverTrigger asChild className="flex p-2">
            <Button
              variant={"outline"}
              className={cn(
                `${error ? "border-red-500" : ""}`,
                "w-[220px] justify-start text-left font-normal",
                !data && "text-muted-foreground",
              )}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              {data ? format(data, "PPP", { locale: ptBR }) : <span>{msg ? msg : "Insira a Data"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className=" w-auto p-0">
            <Calendar
              disabled={disabled === true ? true : false}
              mode="single"
              captionLayout="dropdown-buttons"
              selected={data}
              onSelect={(date) => (setValue ? setValue(name, date as PathValue<T, Path<T>>) : "")}
              fromDate={fromDate ? fromDate : undefined}
              toDate={toDate ? toDate : undefined}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      {/* {hasError && <FormMessage>{errorMessage}</FormMessage>} */}
      {invalid && error && <FormMessage className="text-red-500">{errorMessage}</FormMessage>}
    </FormItem>
  );
};

export default InputCalendar;
