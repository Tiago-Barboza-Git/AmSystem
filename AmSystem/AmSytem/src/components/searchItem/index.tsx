import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import FormFieldInput from "../form/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FormMessage } from "../ui/form";

interface searchItemProps<T extends FieldValues> {
  labelCod: string;
  labelNome: string;
  nameCod: Path<T>;
  nameNome: Path<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  getValue: UseFormGetValues<T>;
  watch: UseFormWatch<T>;
  errorMessage?: string;
  openSearch?: boolean;
  setOpenSearch?: (value: boolean) => void;
  obj?: any;
  setObj?: (value: any) => void;
  disabled?: boolean;
  page?: React.ReactNode;
  className?: string;
  hiddenButton?: boolean;
}

function SearchItem<T extends FieldValues>({
  labelCod,
  labelNome,
  nameCod,
  nameNome,
  control,
  setValue,
  getValue,
  watch,
  errorMessage = "",
  openSearch,
  setOpenSearch,
  obj,
  setObj,
  disabled = false,
  page,
  className,
  hiddenButton,
}: searchItemProps<T>) {
  // if (control.getFieldState(nameCod).error !== undefined)
  const errorCod = control.getFieldState(nameCod).error?.message;
  return (
    <div className={`${className} flex flex-row gap-4 items-center align-middle relative`}>
      <FormFieldInput
        control={control}
        label={labelCod}
        name={nameCod}
        isNumber={true}
        disabled={true}
        errorMessage={errorMessage}
        className={`!w-[10rem]`}
      />

      <FormFieldInput
        control={control}
        label={labelNome}
        name={nameNome}
        disabled={true}
        errorMessage={errorMessage}
        className={`!w-[15rem]`}
      />
      <div className={`${hiddenButton !== undefined && hiddenButton === true ? "hidden" : "visible"} !mt-8`}>
        <Dialog open={openSearch} onOpenChange={(value) => (setOpenSearch ? setOpenSearch(value) : "")}>
          <DialogTrigger asChild className="">
            <Button variant="default" disabled={disabled} className="">
              <Search />
            </Button>
          </DialogTrigger>
          <DialogContent className="!p-0 max-w-4xl">{page}</DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default SearchItem;
