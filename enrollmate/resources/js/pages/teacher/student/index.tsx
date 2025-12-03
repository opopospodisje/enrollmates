import Heading from '@/components/heading';
import RoomTable from '@/components/table/RoomTable';
import TableToolbar from '@/components/table/TableToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table";
import { BookUp2, ListTodo } from 'lucide-react';
import * as React from "react";
import { useState } from 'react';
import { toast } from 'sonner';
import CreateStudentDialog from './Components/CreateStudentDialog';
import { getColumns } from './Components/studentColumns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Students',
    href: '/teacher/students',
  },
];

type Applicant = {
  id: number;
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

type Student = {
  id: number;
  user_id: number;
  applicant_id: number;

  lrn: string;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;

  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;

  current_class_name:string;
};

type StudentIndexProps = {
  students: Student[];
  applicants: Applicant[];
  pendingApplicants: Applicant[];
};

const StudentIndex = ({ students,applicants,pendingApplicants }: StudentIndexProps) => {

  const { delete: destroy } = useForm<Student>();

  const handleDelete = (id: number) => {
    destroy(route('admin.students.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.students.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({applicants, handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: students,
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

  const [filter, setFilter] = useState('all');

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
    router.get(route('teacher.students.index', { filter: newFilter }), {}, { preserveState: true });
  }

  return (
    <div className="container">
      <Head title="Student" />
      <Toaster position='top-center' />

      <Heading title="Student Management" description="Manage Students" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='flex gap-2 bg-gray-50 p-2 rounded-t-lg dark:bg-neutral-900'>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => handleFilterChange('all')}
        >
          All Students
        </Button>
        <Button 
          variant={filter === 'enrolled' ? 'default' : 'outline'} 
          onClick={() => handleFilterChange('enrolled')}
        >
          Enrolled Students
        </Button>
        <Button 
          variant={filter === 'unenrolled' ? 'default' : 'outline'} 
          onClick={() => handleFilterChange('unenrolled')}
        >
          Unenrolled Students
        </Button>
      </div>

      <Separator />

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-2">
          <ListTodo className="text-muted-foreground" size={18} />
          <h2 className="text-md font-semibold">
            {filter === 'all' 
              ? 'All Registered Students Entries.' 
              : `All ${filter === 'enrolled' ? 'Enrolled' : 'Unenrolled'} Students Entries.`}
          </h2>
        </div>
        <CreateStudentDialog applicants={pendingApplicants} />
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

StudentIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default StudentIndex;
