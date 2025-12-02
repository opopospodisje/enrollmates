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
import EditEnrollmentDialog from "./EditEnrollmentDialog";
import { Badge } from "@/components/ui/badge";

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

type ClassGroup = {
  id: number;
  section:{
    id: number;
    name: string;
  }
  school_year:{
    id: number;
    name: string;
  }
};

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;
  class_group_name?: string;

  status:string;
  enrolled_at:string;
};  

export const getColumns = ({
  classGroups,
  students,
  handleDelete,
}: {
  classGroups: ClassGroup[];
  students: Student[];
  handleDelete: (id: number) => void;
}): ColumnDef<Enrollment>[] => [
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
      accessorKey: "status",
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
            <div>Status</div>
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
        const status = row.getValue("status");

        let variant: "default" | "secondary" | "destructive" | "special" | "success" | "different" = "success";

        switch (status) {
          case "promoted":
            variant = "special";
            break;
          case "retained":
            variant = "destructive";
            break;
          case "transferred":
            variant = "different";
            break;
          case "dropped":
            variant = "default";
            break;
        }

        return (
          <div className="px-4 text-center">
            <Badge variant={variant} className="capitalize">
              {String(status)}
            </Badge>
          </div>
        );
      }
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
            <div>Class Name</div>
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
    //roles
    {
      accessorKey: "is_special",
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
            <div>Section Type</div>
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
        const isSpecial = row.getValue("is_special") as boolean;

        const roleString = isSpecial ? 'special' : 'regular';

        let bgColor = '';
        if (roleString === 'special') {
          bgColor = 'bg-amber-500';
        }

        return (
          <div className="flex justify-center">
            <div className={`capitalize text-xs text-center px-2 py-1 rounded-md ${bgColor}`}>
              {roleString}
            </div>            
          </div>
        );
      },
    },
    {
      accessorKey: "enrolled_at",
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
            <div>Enrolled At</div>
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
      cell: ({ row }) => <div className="px-4 capitalize font-medium">{row.getValue("enrolled_at")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const enrollment = row.original;
        return (
          <div className="flex justify-center gap-2">

            <EditEnrollmentDialog enrollment={enrollment} classGroups={classGroups} students={students}/>

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
                    <div onClick={() => handleDelete(enrollment.id!)} className='w-full'>Delete</div>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
];
