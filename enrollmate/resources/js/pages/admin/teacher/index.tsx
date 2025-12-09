import Heading from '@/components/heading';
import RoomTable from '@/components/table/RoomTable';
import TableToolbar from '@/components/table/TableToolbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table";
import { BookUp2, List } from 'lucide-react';
import * as React from "react";
import { useState } from 'react';
import { toast } from 'sonner';
import CreateTeacherDialog from './Components/CreateTeacherDialog';
import { getColumns } from './Components/teacherColumns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Teachers',
    href: '/teachers',
  },
];

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

type TeacherIndexProps = {
  teachers: Teacher[];
  status: string;
};

const TeacherIndex = ({ teachers, status }: TeacherIndexProps) => {

  const { delete: destroy } = useForm<Teacher>();

  const handleDelete = (id: number) => {
    destroy(route('admin.teachers.destroy', id));
    toast.success("Teacher archived successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      if (status === 'archived') {
        router.post(route("admin.teachers.bulkUnarchive"), { ids: selectedIds });
        toast.success("Selected teachers restored successfully!");
      } else {
        router.post(route("admin.teachers.bulkDelete"), { ids: selectedIds });
        toast.success("Selected teachers archived successfully!");
      }
  };

  const handleUnarchive = (id: number) => {
    router.put(route('admin.teachers.unarchive', id));
    toast.success('Teacher restored successfully!');
  };

  const columns = getColumns({ handleDelete, handleUnarchive, isArchived: status === 'archived' })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: teachers,
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

  const onTabChange = (value: string) => {
    router.get(route('admin.teachers.index'), { status: value }, { preserveScroll: true });
  };

  return (
    <div className="container">
      <Head title="Teacher" />
      <Toaster position='top-center' />

      <Heading title="Teacher Management" description="Manage Teachers" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
              <List className="text-muted-foreground" size={18} />
              <h2 className="text-md font-semibold">List of all teachers entries.</h2>
          </div>
          <CreateTeacherDialog />
      </div>
      <Tabs value={status} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
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

TeacherIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default TeacherIndex;
