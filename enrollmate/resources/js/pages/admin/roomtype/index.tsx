import { RoomType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, BedDouble, CornerDownRight, Eye, FileDown, Layers, List, Plus, SquarePen, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import * as React from "react"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from '@/components/ui/label';
import TableExportDropdown from '@/components/TableExportDropdown';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useRef } from 'react';
import CreateRoomTypeDialog from './Components/CreateRoomTypeDialog';
import EditRoomTypeDialog from './Components/EditRoomTypeDialog';
import RoomTable from '@/components/table/RoomTable';
import { getRoomTypeColumns } from './Components/roomTypeColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Room Types',
    href: '/roomtypes',
  },
];

type RoomTypeIndexProps = {
  roomTypes: RoomType[];
  columnsToShow?: Array<string>
};

type RoomTypeFormData = {
  name: string;
};

const RoomTypeIndex = ({ roomTypes, columnsToShow }: RoomTypeIndexProps) => {

  const { delete: destroy } = useForm<RoomTypeFormData>();
  const handleDelete = (id: number) => {
    destroy(route('roomtypes.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

    if (selectedIds.length === 0) {
      alert("No items selected.");
      return;
    }

    router.post(route("roomtypes.bulkDelete"), {
      ids: selectedIds,
    });

    toast.success("Selected Rows Deleted Succesfully!");
  };
  /*
  const columns: ColumnDef<RoomType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const isActive = isSorted !== false;
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()} className="w-full flex justify-between items-center">
            <div>ID</div>
            <div className={isActive ? "" : "opacity-30"}>
              {isSorted === "asc" ? (
                <ArrowDown01 size={12} />
              ) : isSorted === "desc" ? (
                <ArrowDown10 size={12} />
              ) : (
                <ArrowDown01 size={12} />
              )}
            </div>
          </Button>
        )
      },
      cell: ({ row }) => <div className="px-4 text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId)?.toString().toLowerCase() || "";
        const b = rowB.getValue(columnId)?.toString().toLowerCase() || "";
        return a.localeCompare(b);
      },
      header: ({ column }) => {
        const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
        const isActive = isSorted !== false;   // if this column is sorted
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()} className="w-full flex justify-between items-center">
            <div>Name</div>
            <div className={isActive ? "" : "opacity-30"}>
              {isSorted === "asc" ? (
                <ArrowDownAZ size={12} />
              ) : isSorted === "desc" ? (
                <ArrowDownZA size={12} />
              ) : (
                <ArrowDownAZ size={12} />
              )}
            </div>
          </Button>
        )
      },
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const roomType = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/roomtypes/${roomType.id}/show`}><Button variant={'outline'}><Eye /></Button></Link>
            <EditRoomTypeDialog roomType={roomType} />
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant={'outline'} className='text-red-600'><Trash2 /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription> Deleting this room type will permanently remove it.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <div onClick={() => handleDelete(roomType.id)} className='w-full'>Delete</div>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ]
  */

  const fullColumns = getRoomTypeColumns({ handleDelete })

  const columns: ColumnDef<RoomType>[] = columnsToShow
    ? fullColumns.filter(col => {
      // check accessorKey or explicit id
      const key = (col as any).accessorKey ?? col.id
      return key && columnsToShow.includes(key.toString())
    })
    : fullColumns

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: roomTypes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    enableSortingRemoval: false,
  })

  return (
    <div className="container">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <Heading title="Room Type Management" description="Create new room types, view details, and update existing records with ease." icon={Layers} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
              <List className="text-muted-foreground" size={18} />
              <h2 className="text-md font-semibold">List of all room type entries.</h2>
          </div>
          <CreateRoomTypeDialog />
      </div>
      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="p-0">
              <TableToolbar
                  table={table}
                  onDeleteSelected={handleDeleteSelected}
                  useGlobalFilter
              />
          </CardHeader>
          <Separator />
          <CardContent className="px-0">
              <RoomTable table={table} columnsLength={columns.length} />               
          </CardContent>
      </Card>
    </div>
  );
};

RoomTypeIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomTypeIndex;
