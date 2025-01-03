import { Column } from "@tanstack/react-table";
import { HTMLAttributes } from "react";
import { Button } from "../ui/button";
import { ArrowDownIcon, ArrowUpIcon, ChevronsLeftRightIcon } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const DataTableColumnHeader = <TData, TValue>({ column, title }: DataTableColumnHeaderProps<TData, TValue>) => {
  const renderSortIcon = () => {
    const sort = column.getIsSorted();
    if (!sort) {
      return <ChevronsLeftRightIcon className="ml-2 h-4 w-4 rotate-90" />;
    }
    return sort === "desc" ? <ArrowDownIcon className="ml-2 h-4 w-4" /> : <ArrowUpIcon className="ml-2 h-4 w-4" />;
  };
  //   if (column.getCanSort()) {
  //     return <div>{title}</div>;
  //   }
  return (
    <div>
      <Button variant="ghost" className="pl-0 h-8" onClick={column.getToggleSortingHandler()}>
        <span className="font-medium wei">{title}</span>
        {renderSortIcon()}
      </Button>
    </div>
  );
};

export default DataTableColumnHeader;
