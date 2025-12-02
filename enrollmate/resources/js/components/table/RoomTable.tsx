// components/RoomTable.tsx

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

type RoomTableProps<T> = {
  table: ReactTable<T>;
  columnsLength: number;
  showFooter?: boolean;
};

function RoomTable<T>({ table, columnsLength, showFooter = true}: RoomTableProps<T>) {
  return (
    <>
      <div className="overflow-x-auto border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="divide-x">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}
                    className={`${
                      header.column.id === "id"
                        ? "w-20"
                        : header.column.id === "select"
                          ? "p-0 text-center min-w-10 w-[40px]" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="divide-x">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}
                    className={
                      cell.column.id === "select"
                        ? "p-0 text-center" : ""
                    }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsLength} className="text-center py-6">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* selected count and pre/next button */}
      {showFooter && (
        <div className="flex items-center justify-end space-x-2 p-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomTable;
