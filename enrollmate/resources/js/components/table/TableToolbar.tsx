import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Table as TableType } from "@tanstack/react-table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import TableExportDropdown from '@/components/TableExportDropdown';


interface TableToolbarProps<TData> {
  table: TableType<TData>;
  onDeleteSelected?: () => void;
  exportData?: TData[];
  useGlobalFilter?: boolean;
}

export default function TableToolbar<TData>({
  table,
  useGlobalFilter = false,
  onDeleteSelected,
  exportData = table.getRowModel().rows.map(row => row.original)
}: TableToolbarProps<TData>) {
  return (
    <div className='flex items-center gap-2 w-full dark:bg-neutral-900 p-4'>
      {/* Show Entries */}
      <div className="flex items-center gap-2">
        <div className="text-sm">Show</div>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-20 bg-white hover:bg-neutral-100 dark:bg-neutral-950 hover:dark:bg-neutral-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[10, 25, 50, 100].map(pageSize => (
                <SelectItem key={pageSize} value={String(pageSize)}>{pageSize}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Export */}
      <TableExportDropdown data={exportData} />

      {/* Column Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto dark:bg-neutral-950 hover:dark:bg-neutral-900">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {table.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <Input
        name="search"
        placeholder={`Search...`}
        value={
          useGlobalFilter
            ? (table.getState().globalFilter ?? "")
            : (table.getColumn("name")?.getFilterValue() as string) ?? ""
        }
        onChange={(e) => {
          const value = e.target.value;
          if (useGlobalFilter) {
            table.setGlobalFilter(value);
          } else {
            table.getColumn("name")?.setFilterValue(value); // fallback to column
          }
        }}
        className="w-full bg-white dark:bg-neutral-950 "
      />

      {/* Delete Selected */}
      {onDeleteSelected && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="text-red-600 dark:bg-neutral-950 hover:dark:bg-neutral-900"
              disabled={table.getSelectedRowModel().rows.length === 0}
            >
              Delete Selected Rows <Trash2 className="ml-1" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Deleting selected row/s will permanently remove it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>
                <div onClick={onDeleteSelected} className='w-full'>Delete</div>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
