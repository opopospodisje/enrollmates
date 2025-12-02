import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookUp2, FilePlus, List } from 'lucide-react';
import * as React from "react"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import { useState } from 'react';
import CreateApplicantDialog from './Components/CreateApplicantDialog';
import RoomTable from '@/components/table/RoomTable';
import { getColumns } from './Components/applicantColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Applicants',
    href: '/applicants',
  },
];

type GradeLevel = {
  id: number;
  name: string;
};

type SchoolYear = {
  id: number;
  name: string;
};


type Applicant = {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  email: string;
  contact_number: string;
  address: string;
  birthdate:string;
  gender:string;

  school_year_id: number;
  school_year_name: string;

  entrance_exam_score: number;
  exam_taken_at: string;
  status: string;
};

type ApplicantIndexProps = {
  applicants: Applicant[];
  gradeLevels: GradeLevel[];
  schoolYears: SchoolYear[];
  currentSchoolYear: SchoolYear | null;
};

const ApplicantIndex = ({ applicants, gradeLevels,schoolYears,currentSchoolYear}: ApplicantIndexProps) => {

  const { delete: destroy } = useForm<Applicant>();

  const handleDelete = (id: number) => {
    destroy(route('admin.applicants.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.applicants.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({ gradeLevels,schoolYears, currentSchoolYear ,handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: true }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: applicants,
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
      <Head title="Applicant" />
      <Toaster position='top-center' />
      <Heading title="Applicant Management" description="Manage Applicants" icon={BookUp2} />
      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
              <List className="text-muted-foreground" size={18} />
              <h2 className="text-md font-semibold">List of all applicants entries.</h2>
          </div>
          <CreateApplicantDialog gradeLevels={gradeLevels} schoolYears={schoolYears} currentSchoolYear={currentSchoolYear} />
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

ApplicantIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default ApplicantIndex;
