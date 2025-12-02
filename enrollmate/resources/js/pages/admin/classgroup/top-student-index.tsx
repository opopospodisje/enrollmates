import { ClassGroup, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookUp2, List } from 'lucide-react';
import * as React from "react"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import { useState } from 'react';
import CreateClassGroupDialog from './Components/CreateClassGroupDialog';
import RoomTable from '@/components/table/RoomTable';
import { getColumns } from './Components/topStudentsColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Class Groups',
    href: '/classgroups',
  },
];

type SchoolYear = {
  id: number;
  name: string;
};

type Section = {
  id: number;
  name: string
  grade_level: {
    id: number;
    name: string;
  }
};


type ClassGroupIndexProps = {
  sections: Section[];
  schoolYear: SchoolYear;
  schoolYears: SchoolYear[];
  classGroups: ClassGroup[];
};

const ClassGroupIndex = ({classGroups, sections, schoolYear,schoolYears }: ClassGroupIndexProps) => {

  const { delete: destroy } = useForm();

  const handleDelete = (id: number) => {
    destroy(route('admin.classgroups.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.classgroups.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({ sections, schoolYear,schoolYears ,handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: classGroups,
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
      <Head title="Class Group" />
      <Toaster position='top-center' />

      <Heading title="Top Students By Class" description="Manage Class Groups" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
              <List className="text-muted-foreground" size={18} />
              <h2 className="text-md font-semibold">List of all class groups entries.</h2>
          </div>
      </div>
      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="p-0">
              <TableToolbar
                  table={table}
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

ClassGroupIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default ClassGroupIndex;
