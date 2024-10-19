import { CSSProperties, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  onAdd?: () => void;
  onGet?: () => void;
  ativos?: boolean;
  labelAtivos?: string;
  hidden?: boolean;
  setObj?: (obj: any) => void;
  nota?: boolean;
}

const DataTable = <TData, TValue>({
  data = [],
  columns,
  onAdd,
  onGet,
  ativos,
  labelAtivos,
  setObj,
  hidden,
  nota,
}: DataTableProps<TData, TValue>) => {
  const [colorFlag, setColorFlag] = useState<boolean>(false);
  const [filtering, setFiltering] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFiltering,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      globalFilter: filtering,
      rowSelection,
    },
    enableRowSelection: true,
  });

  // style={rowStyles[index]}
  const rowStyles = useMemo(() => {
    let colorFlag = false;
    return data.map((row) => {
      if ((row as any)["numParcela"] === 1) colorFlag = !colorFlag;
      return { backgroundColor: colorFlag ? "#f7f7f7" : "#ffffff" };
    });
  }, [data]);

  const getRowStyle = (currentRow: TData) => {
    if ((currentRow as any)["numParcela"] === 1) setColorFlag(!colorFlag);

    if (colorFlag) {
      return {
        backgroundColor: "#f0f0f0", // Define a cor de fundo com base no flag `isGray`
      };
    }
  };

  const selectedRow = (row: any, event: any) => {
    const cell = event.target.closest("td");
    if (!cell) return;

    const rowElement = cell.parentNode;
    const cells = Array.from(rowElement.children);
    const cellIndex = cells.indexOf(cell);

    if (cellIndex === cells.length - 1) {
      // Clicado na última coluna (coluna de ações)
      return;
    }

    setObj && setObj({ ...row.original });
  };

  return (
    <div>
      <div className={`${hidden === true ? "hidden" : "visible"} flex flex-row justify-between`}>
        <div className="flex flex-row gap-2">
          <div className={`${hidden === true ? "hidden" : "visible"} flex flex-col gap-2`}>
            <Label>Pesquisar</Label>
            <Input className="w-50" value={filtering} onChange={(e) => setFiltering(e.target.value)} />
          </div>
        </div>
        <div
          className={`${ativos !== undefined && setObj === undefined ? "visible" : "hidden"} flex flex-col gap-4 items-center`}
        >
          <Label>{labelAtivos !== undefined ? labelAtivos : "Ativos"}</Label>
          <Switch
            defaultChecked={ativos}
            onCheckedChange={onGet}
            className={`${labelAtivos === "Canceladas" ? (ativos ? "!bg-red-500" : "!bg-gray") : ativos ? "!bg-green-500" : "!bg-gray"}`}
          />
        </div>
        <Button
          onClick={() => (onAdd !== undefined ? onAdd() : "")}
          className={`${onAdd === undefined ? "hidden" : "visible"}`}
        >
          Adicionar
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const styles: CSSProperties =
                    header.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH ? { width: `${header.getSize()}px` } : {};
                  return (
                    <TableHead key={header.id} style={styles}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <TableRow key={row.id} onClick={(event) => selectedRow(row, event)} style={rowStyles[index]}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={`${hidden === true ? "hidden" : "visible"} flex flex-row justify-between`}>
        <div className="w-full">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15, 20, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Próximo
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
