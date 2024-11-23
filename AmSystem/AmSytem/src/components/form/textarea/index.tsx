import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // Ajuste o caminho conforme necessário
import { Textarea } from "@/components/ui/textarea";

export interface FormFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  maxLength?: number;
  [key: string]: any;
}

const FormFieldTextArea = <T extends FieldValues>({
  name,
  control,
  label,
  className = "",
  errorMessage,
  disabled = false,
  maxLength,
  ...rest
}: FormFieldInputProps<T>) => {
  const {
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  const hasError = errorMessage ? errorMessage?.length > 0 : false;

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={`flex flex-col gap-2 justify-center ${className}`}>
          <FormLabel className={`${hasError ? "text-red-500" : ""}`}>{label}</FormLabel>
          <FormControl>
            <Textarea
              disabled={disabled}
              value={field.value}
              onChange={(event) => {
                const { value } = event.target;

                if (maxLength && value.length > maxLength) {
                  return; // Bloqueia a digitação se ultrapassar maxLength
                }

                if (!value) {
                  field.onChange(String(""));
                } else {
                  field.onChange(value);
                }
              }}
              className={`${hasError ? "border-red-500" : ""}`}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          </FormControl>
          {invalid && error && <FormMessage className="text-red-500">{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default FormFieldTextArea;
