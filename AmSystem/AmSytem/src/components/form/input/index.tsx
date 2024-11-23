import React from "react";
import { Control, FieldValues, Path, UseFormWatch, useController, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input"; // Ajuste o caminho conforme necessário
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // Ajuste o caminho conforme necessário
import { error } from "console";
import { Label } from "@radix-ui/react-label";

export interface FormFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  className?: string;
  errorMessage?: string;
  isNumber?: boolean;
  disabled?: boolean;
  maskFunction?: (value: string) => string;
  trigger?: (name: Path<T>) => Promise<boolean>; // Adiciona a prop trigger
  maxLength?: number;
  [key: string]: any;
}

const FormFieldInput = <T extends FieldValues>({
  name,
  control,
  label,
  className = "",
  errorMessage,
  isNumber = false,
  disabled = false,
  maskFunction,
  parseFunction,
  trigger,
  maxLength,
  ...rest
}: FormFieldInputProps<T>) => {
  const {
    field,
    fieldState: { error, invalid },
    formState,
  } = useController({
    name,
    control,
  });

  const hasError = errorMessage ? errorMessage?.length > 0 : false;

  return (
    <FormItem className={className}>
      <FormLabel>
        <Label>{label}</Label>
      </FormLabel>
      <FormControl>
        <Input
          disabled={disabled}
          value={maskFunction ? maskFunction(field.value) : field.value}
          className={`${hasError ? "border-red-500" : ""}`}
          onChange={async (event) => {
            const { value } = event.target;

            if (maxLength && value.length > maxLength) {
              return; // Bloqueia a digitação se ultrapassar maxLength
            }

            if (!value) {
              if (isNumber) {
                field.onChange(Number(0));
              } else {
                field.onChange(String(""));
              }
            } else {
              if (isNumber) {
                if (/^\d*$/.test(value)) {
                  field.onChange(Number(value));
                }
              } else {
                const maskedValue = maskFunction ? maskFunction(value) : value;
                field.onChange(maskedValue);
              }
            }
            trigger && (await trigger(name)); // Trigger validation in real-time as user types
          }}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      </FormControl>
      {/* {hasError && <FormMessage>{errorMessage}</FormMessage>} */}
      {hasError ? (
        error?.message ? (
          <FormMessage className="text-red-500"> {error?.message || "Obrigatório"}</FormMessage>
        ) : (
          <FormMessage className="text-red-500"> {"Obrigatório"}</FormMessage>
        )
      ) : (
        <span></span>
      )}
    </FormItem>
  );
};

export default FormFieldInput;
