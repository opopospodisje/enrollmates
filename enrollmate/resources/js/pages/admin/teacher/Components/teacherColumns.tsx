import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  Eye,
  Trash2,
} from "lucide-react";
import { Link } from '@inertiajs/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import EditTeacherDialog from "./EditTeacherDialog";

type Teacher = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;
};

export const getColumns = ({
  handleDelete,
}: {
  handleDelete: (id: number) => void;
}): ColumnDef<Teacher>[] => [

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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("last_name")}</div>,
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("first_name")}</div>,
    },
    {
      accessorKey: "middle_name",
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
            <div>Middle Name</div>
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("middle_name")}</div>,
    },
    {
      accessorKey: "suffix",
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
            <div>Suffix</div>
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
      cell: ({ row }) => {const value = row.getValue("suffix");
        return (
            <div className={`px-4 capitalize font-medium ${!value || value.toString().trim() === "" ? "text-muted-foreground" : ""}`}>
            {value && value.toString().trim() !== "" ? value.toString() : "N/A"}
            </div>
        );
      },
      },
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("email")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Link href={`/teachers/${teacher.id}/show`}><Button variant={'outline'}><Eye /></Button></Link>
            <EditTeacherDialog teacher={teacher} />
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
                    <div onClick={() => handleDelete(teacher.id)} className='w-full'>Delete</div>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
];
