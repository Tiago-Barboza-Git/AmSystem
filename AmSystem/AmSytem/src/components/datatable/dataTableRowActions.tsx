import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ghost, MoreHorizontal } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (value: TData) => void;
  onView?: (value: TData) => void;
  onDelete?: (value: TData, index: number) => void;
  onCancel?: (value: TData, index: number) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onView,
  onDelete,
  onCancel,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className={`${onEdit === undefined ? "hidden" : "visible"}`}
          onClick={() => (onEdit !== undefined ? onEdit(row.original) : "")}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`${onView === undefined ? "hidden" : "visible"}`}
          onClick={() => (onView !== undefined ? onView(row.original) : "")}
        >
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`${onDelete === undefined ? "hidden" : "visible"}`}
          onClick={() => (onDelete !== undefined ? onDelete(row.original, row.index) : "")}
        >
          Deletar
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${onCancel === undefined ? "hidden" : "visible"}`}
          onClick={() => (onCancel !== undefined ? onCancel(row.original, row.index) : "")}
        >
          Cancelar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// const DataTableRowActions = <TData,>({row, onEdit, onDelete}: DataTableRowActionsProps<TData>) => {

// }
