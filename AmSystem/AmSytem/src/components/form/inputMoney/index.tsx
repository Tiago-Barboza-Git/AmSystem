// import { Input } from "@/components/ui/input";
// import { FormFieldInputProps } from "../input";

// interface InputMoneyProps extends FormFieldInputProps {
//   value: number;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   addonBefore?: string;
// }

// const InputMoney = ({
//   value,
//   onChange,
//   addonBefore = "R$",
// }: InputMoneyProps) => {
//   return
//     <Input />
// };

// export default InputMoney;

export const currencyFormatter = (Lang: string, currency: any) => {
  const formatter = Intl.NumberFormat(Lang, {
    style: "currency",
    maximumFractionDigits: 2,
    currency,
  });

  return {
    format: (value: number | bigint) => formatter.format(value),
    parse: (value: string) => {
      const numericValue = value.replace(/[^\d,-]/g, "").replace(",", ".");
      return parseFloat(numericValue) || 0;
    },
  };
};
