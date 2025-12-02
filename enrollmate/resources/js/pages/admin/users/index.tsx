import { RoomType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, BedDouble, CornerDownRight, Eye, FileDown, List, Plus, SquarePen, Trash2, User, User2, UserCog } from 'lucide-react';
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
import RoomTable from '@/components/table/RoomTable';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import CreateUserDialog from './Components/CreateUserDialog';
import EditUserDialog from './Components/EditUserDialog';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User',
    href: '/users',
  },
];

interface User {
  id: number;
  first_name: string;
  last_name: string;
  contact_number:string;
  address:string;
  email: string;
  role:string;
  role_id:number;
  is_verified:boolean;
}

type Role = {
  id: number;
  name: string;
}

type UserIndexProps = {
  users: User[];
  roles: Role[];
};

const UserIndex = ({ users,roles }: UserIndexProps) => {

  const {delete: destroy} = useForm();

  const handleDelete = (id: number) => {
    destroy(route('admin.users.destroy', id));
    toast.success("User deleted successfully!");
  };  

  const handleDeleteSelected = () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

    if (selectedIds.length === 0) {
      alert("No items selected.");
      return;
    }

    router.post(route("admin.users..bulkDelete"), {
      ids: selectedIds,
    });

    toast.success("Selected Rows Deleted Succesfully!");
  };
  
  const columns: ColumnDef<User>[] = [
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
      accessorKey: "first_name",
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
            <div>First Name</div>
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
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("first_name")}</div>,
    },
    {
      accessorKey: "last_name",
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
            <div>Last Name</div>
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
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("last_name")}</div>,
    },
    {
      accessorKey: "contact_number",
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
            <div>Contact #</div>
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
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("contact_number")}</div>,
    },
    {
      accessorKey: "address",
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
            <div>Address</div>
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
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("address")}</div>,
    },

    //email
    {
      accessorKey: "email",
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
            <div>Email</div>
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
      cell: ({ row }) => <div className="px-4 capitalize">{row.getValue("email")}</div>,
    },

    //roles
    {
      accessorKey: "role",
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
            <div>Role</div>
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
      cell: ({ row }) => {
        const roleString = row.getValue("role") as string;
        let bgColor = 'bg-purple-500';
        if (roleString === 'student') {
          bgColor = 'bg-neutral-500';
        } else if (roleString === 'teacher') {
          bgColor = 'bg-orange-500';
        }

        return (
          <div className={`capitalize text-xs text-white text-center px-3 py-1 rounded-full ${bgColor}`}>
            {roleString}
          </div>
        );
      },
    },

    //actions
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <EditUserDialog roles={roles} user={user} />
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
                    <div onClick={() => handleDelete(user.id)} className='w-full'>Delete</div>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ]
      
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({pageIndex: 0,pageSize: 100,});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: users,
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
      <Head title="Users" />
      <Toaster position='top-center' />

      <Heading title="User Management" description="Create new accounts, view detailed user profiles, assign roles, and update existing records efficiently." icon={UserCog} />

      <div className='relative border-y py-2 my-4'>
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-2">
            <List className="text-muted-foreground" size={18} />
            <h2 className="text-md font-semibold">List of all user accounts.</h2>
        </div>

        <CreateUserDialog roles={roles} />
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

UserIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default UserIndex;
