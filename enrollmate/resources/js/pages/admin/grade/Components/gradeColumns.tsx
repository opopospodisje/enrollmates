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
import { Head, Link, router, useForm } from '@inertiajs/react';
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
import EditGradeDialog from "./EditGradeDialog";
import { Badge } from "@/components/ui/badge";

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;
  
  status:string;
  enrolled_at:string;
};   

export const getColumns = (): ColumnDef<Enrollment>[] => [
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
      accessorKey: "student_name",
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
            <div>Student Name</div>
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("student_name")}</div>,
    },
    {
      accessorKey: "gender",
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
            <div>Student Gender</div>
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("gender")}</div>,
    },
    {
      accessorKey: "class_group_name",
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
            <div>Current Class Grade</div>
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("class_group_name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const enrollment = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Link href={route('admin.grades.edit', enrollment.id)}><Button variant={'default'}>Input Grades</Button></Link>
          </div>
        );
      },
    },
];
